require("dotenv").config({ path: '../../.env' });
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// module.exports = {

module.exports = {
    development: {
        client: "pg",
        connection: {
            user: "app",
            password: "app",
            database: "app",
        },
        // connection: process.env.PG_CONNECTION_STRING,
        // searchPath: ['knex', 'public'],
        seeds: {
            directory: "./seeds",
        },
    },
    test: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
        },
        migrations: {
            tableName: "migrations",
        },
        seeds: {
            directory: "./seeds",
        },
    },
};
