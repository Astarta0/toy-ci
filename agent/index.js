const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const config = require('./config');
const AGENT_DATA = require('./agentData');
const { delay, runBuild } = require('./utils');

const agentApp = express();
agentApp.use(bodyParser.json());

const baseURL = `${config.server_host}:${config.server_port}`;

process.chdir(os.tmpdir());

// Запустить сборку
agentApp.post('/build', (req, res) => {
    const { build } = req.body;
    res.status(200).send({ status: 'OK' });
    console.log(`Agent start processing build with id ${build.id}`);

    runBuild(build);
});


agentApp.listen(config.app_port, async function notifyServer(count = 0) {
    try {
        const { data } = await axios.post(`${config.server_protocol}://${baseURL}/notify_agent`, {
            agent_port: config.app_port,
            agent_host: config.app_host
        });

        if( !data || data.status !== 'OK' ) {
            console.log(status);
            throw new Error('Cannot register my instance');
        }

        AGENT_DATA.uuid = data.uuid;

        console.log(`Agent successfully registered as ${data.uuid}!`);
        console.log(`Agent listening on port ${config.app_port}!`);
    } catch(e) {
        console.error(`Failed to register on the server: `, e.message);

        if(count < config.retry_connection - 1) {
            console.error(`Will retry in ${config.retry_delay}ms`);
            count++;
            await delay(config.retry_delay);
            await notifyServer(count)
        } else {
            console.error('Shotdown');
            process.exit(1);
        }
    }
});

setInterval(
    async () => {
        try {
            await axios.post(`${config.server_protocol}://${baseURL}/keep_alive`, {
                agent_uuid: AGENT_DATA.uuid
            });
            console.log('[Keep alive] Ping server');
        } catch (err) {
            console.error('[Keep alive] Pooling error:', err.message);
        }
    },
    config.keep_alive_interval
);
