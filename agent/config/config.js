const config = {
    server: {
        host: 'localhost',
        port: 3000,
        protocol: 'http'
    },
    agent: {
        port: '80',
        host: 'localhost',
        retryConnection: 5,
        retryDelay: 10000,
        // как часто посылать ping на сервер
        keepAliveInterval: 10000
    }
};

module.exports = config;
