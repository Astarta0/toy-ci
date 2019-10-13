import config from '../config';
import { AGENT_STATUSES } from './constants';
import Agent from './agent';
import db from './db';

export const serverInit = ({ app }) => {
    const APP_PORT = config.port;
    app.listen(APP_PORT, () => {
        console.log(`Server listening on port ${APP_PORT}!`);
    });
};

export const wrapRoute = fn => (...args) => fn(...args).catch(args[2]);

export const agentRegistration = ({ agent_port, agent_host }) => {
    const agent = new Agent({ agent_port, agent_host });
    db.get('agents').push(agent).write();
    console.log('*'.repeat(3));
    console.log(`Agent with id ${agent.uuid} was successfully registered`);
    console.log('*'.repeat(3));
    return agent;
};

export const delay = ms => new Promise(function (resolve) {
    setTimeout(() => {
        resolve()
    }, ms)
});

