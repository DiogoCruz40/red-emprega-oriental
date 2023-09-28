
return module.exports = config = {
    mongo: {
        uri: process.env.MONGO_URL ||
            'mongodb://127.0.0.1/database/rede_emprega_db',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: "redEmprega",
            pass: "g9rFv+fm3i56<RszP"
        },

    },
    NODEJS_PORT: process.env.port ||
        process.env.NODE_ENV === 'production' ? '8443' : '8080',
    DB_HOST: 'redis',
    DB_PORT: 6379,
    DOMAIN:   process.env.NODE_ENV === 'production' ? 'https://workipedia.pt': 'http://localhost',
};