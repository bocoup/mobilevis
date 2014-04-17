const config = require("../../config/db");
const db_config = require(config.db_config);
const DB = require('./database')(db_config);

var Checkit = require('checkit');

Checkit.Validators.unused = function (val, table, column) {
  return DB.knex(table).where(column, val.toLowerCase()).then(function (results) {
    if (results.length > 0) {
      throw new Error('That '+column+' is already in use.');
    }
  });
};

module.exports = Checkit;
