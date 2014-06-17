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

if (!process.env.testing) {

  /*
    When the application starts, it will check to see which migrations last ran
    and run any newer migrations. This will also load some base data if this is a
    new database.
   */
  db.knex.migrate.latest(config).then(function () {

    // if running sqlite3 in development on initial load, insert test data
    if(config.database.client === "sqlite3" && newDB) {

      var data = {
        submissions : require('../../test/fixtures/submissions'),
        submission_tags : require('../../test/fixtures/submission_tags'),
        tags : require('../../test/fixtures/tags'),
        comments : require('../../test/fixtures/comments'),
        images : require('../../test/fixtures/images'),
      };

      sequence([
        function(){return db.knex('submissions').insert(data.submissions);},
        function(){return db.knex('tags').insert(data.tags);},
        function(){return db.knex('comments').insert(data.comments);},
        function(){return db.knex('submission_tags').insert(data.submission_tags);},
        function(){return db.knex('images').insert(data.images);},
      ]);
    }
  });
}

module.exports = db;