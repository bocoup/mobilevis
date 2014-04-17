const Bookshelf = require('bookshelf');
const config = require("../../config/db");
const db_config = require(config.db_config);
const db = Bookshelf.initialize(db_config.database);

module.exports = function(config) {
  return db;
};
