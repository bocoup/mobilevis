const Bookshelf = require('bookshelf');
const fs = require('fs');
const sequence = require('when/sequence');

var config;
var newDB = false;

/*
When initializing a database connection, check the environment variable
'testing'. If set, then use the sqlite db. Otherwise, if the second
argument to the run is 'sqlite3', use a sqlite db as well. Otherwise,
if no additional arguments were provided, use the postgres connection.
It's messy, but so it goes...
 */
if (process.env.testing) {
  console.log('Connecting to SQLite3 testing database...');
  config = require('../../test/config/db');
} else if (process.argv[2] === 'sqlite3') {
  console.log('Connecting to SQLite3 development database...');
  config = require('../../config/db_sqlite');
  newDB = !fs.existsSync(config.database.connection.filename);
} else {
  console.log('Connecting to PostgreSQL database...');
  config = require('../../config/db_pg');
}

const db = Bookshelf.initialize(config.database);


module.exports = db;
