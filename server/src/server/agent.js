import uuidv1 from 'uuid/v1';
import { AGENT_STATUSES } from './constants';

export default class Agent {
    constructor({ agent_port, agent_host }) {
        this.port = agent_port;
        this.host = agent_host;
        this.url = `${agent_host}:${agent_port}`;
        this.status = AGENT_STATUSES.free;
        this.uuid = uuidv1();
        this.keepAlive = Date.now();
    }

    updateStatus = status => {
        this.status = status;
    }
}
