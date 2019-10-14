import config from './config';

const [ , , port_arg, repo_arg ] = process.argv;

export const APP_PORT = process.env.APP_PORT;
export const REPO_URL = process.env.REPOSITORY_URL;

export default {
    port: port_arg || APP_PORT || config.server.port,
    repositoryUrl: repo_arg || REPO_URL || config.repository.url,
    retry: config.server.retry,
    delay: config.server.delay,
    keepAliveTimeout: config.server.keepAliveTimeout,
}
