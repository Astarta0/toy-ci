const config = {
    server: {
        port: 3000,
        retry: 5,
        delay: 10000,
        // после какого времени считать агент умершим
        keepAliveTimeout: 20000
    },
    repository: {
        url: 'https://github.com/Astarta0/tree-ui.git'
    }
};

export default config;
