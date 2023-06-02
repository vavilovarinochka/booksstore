require("dotenv").config({ path: "../../.env" });

module.exports = {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
        },
        seeds: {
            directory: "./seeds",
        },
        debug: true,
    },

    production: {
        client: "postgresql",
        connection: process.env.PG_CONNECTION_STRING || {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "migrations",
        },
        seeds: {
            directory: "./seeds",
        },
    },
};
