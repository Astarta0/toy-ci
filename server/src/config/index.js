import config from './config';

export const REPO_URL = process.env.REPOSITORY_URL;
export const APP_PORT = process.env.APP_PORT;

export default {
    port: APP_PORT || config.server.port,
    repositoryUrl: REPO_URL || config.repository.url,
    retry: config.server.retry,
    delay: config.server.delay,
    keepAliveTimeout: config.server.keepAliveTimeout,
}
