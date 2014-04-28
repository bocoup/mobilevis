const Bookshelf = require('bookshelf');
const fs = require('fs');
const sequence = require('when/sequence');

var config;
var newDB = false;
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