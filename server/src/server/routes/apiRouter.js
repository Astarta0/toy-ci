import express from 'express';
import uuidv1 from 'uuid/v1';
import axios from 'axios';

import * as utils from '../utils';
import config from '../../config';
import {AGENT_STATUSES, BUILD_STATUSES} from '../constants';
import db from '../db';

const apiRouter = express.Router();

// '/' = '/api/v1/build/'
// вернуть все сборки
apiRouter.get('/builds', utils.wrapRoute(
    async (req, res) => {
        res.json({
            builds: db.get('builds').value()
        });
    }
));

apiRouter.get('/:id', utils.wrapRoute(
    async (req, res) => {
        const { id } = req.params;

        res.json({
            build: db.get('builds').find(b => b.id === id).value()
        });
    }
));

// передать задание на сборку агенту
apiRouter.post('/', utils.wrapRoute(
    async (req, res) => {
        const { commitHash, command } = req.body;

        const build = {
            id: uuidv1(),
            commitHash,
            command,
            repositoryUrl: config.repositoryUrl,
            status: BUILD_STATUSES.PENDING,
            stdout: '',
            stderr: '',
            code: null,
            agent: null,
            triggered: Date.now(),
            start: null,
            finished: null
        };

        db.get('builds').set(build.id, build).write();

        console.log(`New build appeared ${build.id}`);

        res.json({ build });

        processingBuild(build.id);
    }
));

export async function processingBuild(buildId) {
    const freeAgent = db.get('agents')
        .find({ status: AGENT_STATUSES.free })
        .value();

    const build = db.get('builds').find(build => build.id === buildId).value();

    if (freeAgent) {
        const isSent = await sendBuildrequest({ build, agent: freeAgent });

        // не удалось отправить
        if(!isSent) {
            // удаляем агента, так как он не отвечает
            db.get('agents').remove(agent => agent.uuid === freeAgent.uuid).write();
            // процессим сборку дальше
            return processingBuild(build.id);
        }

        db.get('agents')
            .find({ uuid: freeAgent.uuid })
            .set('status', AGENT_STATUSES.busy)
            .write();

        db.get('builds')
            .find(build => build.id === buildId)
            .set('status', BUILD_STATUSES.PROCESSING)
            .set('agent', freeAgent.uuid)
            .write();

        console.log(`Build ${build.id} is processing by ${freeAgent.uuid} agent`);

    } else {
        db.get('buildsFifo').push(build).write();
    }
}

export async function sendBuildrequest({ build, agent , count = 0 }) {
    const { data } = await axios.post(`http://${agent.url}/build`, {
        build
    });

    if((!data || data.status !== 'OK') && count < config.retry - 1) {
        console.log(status);
        console.error(`Cannot send build task for agent with id ${agent.uuid}`);
        await utils.delay(config.delay);
        count++;
        await sendBuildrequest({ build, agent, count })
    }

    return data.status === 'OK';
}


export default apiRouter;
