const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const config = require('./config');
const AGENT_DATA = require('./agentData');
const { runBuild, startAgent } = require('./utils');

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

startAgent({ agentApp, config });

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
