'use strict';
const knex_config = require('./../config').db;
module.exports = require('knex')(knex_config);
