const knex = require("knex");
const knexfile = require("./knexfile");
require("dotenv").config();

const configOptions = knexfile[process.env.NODE_ENV || "development"];
const database = knex(configOptions);

module.exports = database;
