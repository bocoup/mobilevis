const Bookshelf = require('bookshelf');

module.exports = function(config) {
  if (typeof config === "undefined") {
    config = require("../../config/db_sqlite.js");
  }
  return Bookshelf.initialize(config.database);
};
