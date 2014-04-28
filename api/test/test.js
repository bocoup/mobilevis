process.env.testing = true;

require('mocha-as-promised')();

const chai = require('chai');
const when = require('when');
const sequence = require('when/sequence');

const config = require('./config/db');
const DB = require('../app/classes/database')(config);

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;

global.DATA = {
  submissions : require('./fixtures/submissions'),
  submission_tags : require('./fixtures/submission_tags'),
  tags : require('./fixtures/tags'),
  comments : require('./fixtures/comments'),
  images : require('./fixtures/images'),
};

global.express = require('express');
global.supertest = require('supertest');
global.routeBuilder = require('express-routebuilder');

global.app = require('../index');

global.dbSetup = function (rollback) {

  var ready = true;

  // if requested, drop all data in database
  if (rollback) {
    ready = DB.knex.migrate.rollback(config);
  }

  // load most current migration and all data
  return when(ready).then(function () {
    return DB.knex.migrate.latest(config).then(function () {
      var data = global.DATA;
      return sequence([
        function(){return DB.knex('submissions').insert(data.submissions);},
        function(){return DB.knex('tags').insert(data.tags);},
        function(){return DB.knex('comments').insert(data.comments);},
        function(){return DB.knex('submission_tags').insert(data.submission_tags);},
        function(){return DB.knex('images').insert(data.images);},
      ]);
    });
  });
};

describe('API', function () {

  before(function() {
    return dbSetup(false);
  });

  describe('Models', function () {
    require('./models/submission');
    require('./models/comment');
    require('./models/tag');
    require('./models/image');
  });

});