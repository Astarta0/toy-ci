const config = require('./config');

const [ , , port_arg, host_arg ] = process.argv;
const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;
const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_PROTOCOL = process.env.SERVER_PROTOCOL;

const priorityPort = port_arg || APP_PORT || config.agent.port;

module.exports = {
    app_port: priorityPort,
    app_host: host_arg || APP_HOST || config.agent.host,
    server_host: SERVER_HOST || config.server.host,
    server_port: SERVER_PORT || config.server.port,
    server_protocol: SERVER_PROTOCOL || config.server.protocol,
    retry_connection: config.agent.retryConnection,
    retry_delay: config.agent.retryDelay,
    keep_alive_interval: config.agent.keepAliveInterval,
};
