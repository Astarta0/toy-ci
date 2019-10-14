const os = require('os');
const axios = require('axios');
const util = require('util');
const child = require('child_process');
const rimrafCb = require('rimraf');

const rimraf = util.promisify(rimrafCb);

const config = require('./config');
const AGENT_DATA = require('./agentData');

const baseURL = `${config.server_host}:${config.server_port}`;

const exec = logify(util.promisify(child.exec));

function logify(fn){
    return (...args) => {
        console.log('>', ...args);
        return fn(...args);
    };
}

function updateBuild({ build , props}){
    return {
        ...build,
        ...props
    }
}

function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(() => {
            resolve()
        }, ms)
    });
}

function combine(...commands) {
    return commands.join(' && ');
}

async function runBuild(build) {
    const {id, commitHash, command, repositoryUrl} = build;
    build = updateBuild({ build, props: {
        start: Date.now()
    }});
    const buildDir = `${os.tmpdir()}/${id}`;

    // удаляем папку на тот случай, если билд с таким айди был уже запущен
    // на этом хосте, но был прерван и папка не была очищена
    await rimraf(buildDir);

    console.log(`Build ${build.id} will be processed within ${buildDir}`);

    try {
        const gitDir = `--git-dir=${buildDir}/.git`;
        const workTree = `--work-tree=${buildDir}`;

        const {stdout, stderr} = await exec(combine(
            `GIT_TERMINAL_PROMPT=0 git clone ${repositoryUrl} ${id}`,
            `git ${gitDir} ${workTree} checkout --force ${commitHash}`,
            `cd ${buildDir}`,
            command
        ));

        build = updateBuild({ build, props: {stdout, stderr, code: 0, finished: Date.now() }});

        console.log(`Build ${build.id} has finished`);

    } catch (e) {
        const {code, message, stderr, stdout} = e;
        build = updateBuild({ build, props: {stdout, stderr, code, finished: Date.now() }});
        console.log(`Build ${build.id} has failed with code ${code} and message "${message}"`);
    }

    await rimraf(buildDir);

    sendBuildResult(build);
}

async function sendBuildResult(build, count = 0) {
    console.log(`Sending build ${build.id} to server`, count ? `(attempt ${count})` : '');
    try {
        const result = await axios.post(`${config.server_protocol}://${baseURL}/notify_build_result`, {
            build,
            agent_uuid: AGENT_DATA.uuid
        });
        console.log(`Build ${build.id} sent to server`);
    } catch (err) {
        console.error(`Failed to send build results to server, will retry in ${config.retry_delay}ms`);
        if(count < config.retry_connection - 1) {
            count++;
            await delay(config.retry_delay);
            await sendBuildResult(build, count)
        } else {
            console.error('There was no successful attempts to send build results to server, shutdown');
            process.exit(1);
        }
    }
}

module.exports = {
    delay,
    runBuild,
    sendBuildResult
};
