import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import db from './db';
import config from '../config';
import {AGENT_STATUSES, BUILD_STATUSES} from './constants';
import { errorHandler } from './middlewares';
import apiRouter, { processingBuild } from './routes/apiRouter';
import { serverInit, agentRegistration } from './utils';

const app = express();

app.use('/static', express.static(`${__dirname}/../../static`));
app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});

app.use('/api/v1/build/', apiRouter);

// Зарегистрировать агента.
app.post('/notify_agent', (req, res) => {
    const { agent_port, agent_host } = req.body;
    const agent = agentRegistration({ agent_port, agent_host });
    db.set('agents.' + agent.uuid, agent).write();
    res.status(200).send({
        status: 'OK',
        uuid: agent.uuid
    });

    // проверить очередь задач и если есть задачи - отдать агенту
    const buildsFifoLength = db.get('buildsFifo').size().value();
    if (buildsFifoLength) {
        const build = db.get('buildsFifo').shift().write();
        processingBuild(build.id);
    }
});

// Cохранить результаты сборки.
app.post('/notify_build_result', (req, res) => {
    const { build, agent_uuid } = req.body;
    res.status(200).send({ status: 'OK' });
    const status = build.code === 0 ? BUILD_STATUSES.SUCCESS : BUILD_STATUSES.FAILED;

    db.get('builds').get(build.id)
        .set('status', status)
        .set('stdout', build.stdout)
        .set('stderr', build.stderr)
        .set('start', build.start)
        .set('code', build.code)
        .set('finished', build.finished)
        .write();

    db.get('agents')
        .find({ uuid: agent_uuid })
        .set('status', AGENT_STATUSES.free)
        .value();

    console.log(`Agent ${agent_uuid} returned build ${build.id} with status ${status} (code: ${build.code})`);

    // проверить очередь задач и если есть задачи - отдать агенту
    const buildsFifoLength = db.get('buildsFifo').size().value();
    if (buildsFifoLength) {
        const build = db.get('buildsFifo').shift().write();
        processingBuild(build.id);
    }
});

app.post('/keep_alive', (req, res) => {
    const { agent_uuid } = req.body;
    db.get('agents').find({ uuid: agent_uuid }).set('keepAlive', Date.now()).write();
    res.json({ status: 'OK' });
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../index.html'));
});


// -- end --
app.use(errorHandler);

serverInit({ app });

setInterval(
    async () => {
        db.get('agents').filter(agent => {
            const delta = Date.now() - agent.keepAlive;
            return delta > config.keepAliveTimeout;
        }).map(agent => {
            console.log(`Agent ${agent.uuid} is dead :(`);
            db.get('agents').remove(a => a.uuid === agent.uuid).write();
            const build = db.get('builds').find({ agent: agent.uuid, status: BUILD_STATUSES.PROCESSING }).value();
            if (build) {
                build.agent = null;
                build.status = BUILD_STATUSES.PENDING;
                processingBuild(build.id);
            }
        }).value();
    },
    config.keepAliveTimeout
);
