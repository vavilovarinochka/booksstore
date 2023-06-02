const knex = require("knex");
const config = require("../database/knexfile");
require("dotenv").config();

module.exports = knex(config[process.env.NODE_ENV] || config.development);
