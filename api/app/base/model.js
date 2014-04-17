const config = require("../../config/db");
const db_config = require(config.db_config);
const DB = require('../classes/database')(db_config);

const Validate = require('../classes/validations');
const _ = require('lodash');
const Promise = require('when');

var instanceProps = {
  validator: function (params) {
    return new Validate(params);
  },
  /* this breaks bookshelf post 0.6.2
  format: function (params) {
    var fields = _.intersection(Object.keys(params), this.constructor.fields);
    return _.pick(params, fields);
  },
  */
  save: function (params, opts) {
    var self = this;
    var saveMethod = DB.Model.prototype.save;
    var fields = params || this.attributes;
    if (this.validate) {
      return this.validate(fields, opts).then(function () {
        return saveMethod.call(self, params, opts);
      });
    } else {
      return saveMethod.call(self, params, opts);
    }
  },
  toJSON: function () {
    var result = DB.Model.prototype.toJSON.call(this);
    var booleanFields = this.constructor.booleanFields;
    // remove any keys with a leading underscore from serialization
    var removeKeys = _.filter(_.keys(result), function (key) {
      return key[0] === "_";
    });
    // cast fields to true/false for sqlite3
    booleanFields.forEach(function (field) {
      result[field] = !!result[field];
    });
    return _.omit(result, removeKeys);
  },
  serialize: function() {
    var result = this.toJSON();
    var links = this.constructor.links;
    if (links.length) {
      result.links = {};
    }
    links.forEach(function (link) {
      var url = [db_config.prefix, this.tableName, this.get('id'), link].join('/');
      result.links[link] = url;
    }, this);
    return result;
  }
};

var classProps = {
  fields: [],
  booleanFields: [],
  dependents: [],
  links: [],
  collection: function () {
    return DB.Collection.forge([], {model: this});
  },
  db: function (table) {
    if (table) {
      return DB.knex(table);
    } else {
      return DB.knex;
    }
  },
  byId: function (id, opts) {
    return this.forge({id:id}).fetch(opts||{});
  },
  create: function (params) {
    return this.forge(params).save();
  },
  findOrCreate: function (createParams, findParams) {
    var self = this;
    findParams = findParams || createParams;
    var find = this.forge(findParams).fetch();
    return find.then(function (result) {
      if (result) {
        return find;
      } else {
        // after creation, retrieve record from database to
        // provide any fields that were automatically populated
        return self.forge({}).save(createParams, {insert:true}).then(function (model) {
          return self.byId(model.id);
        });
      }
    });
  }
};

module.exports = DB.Model.extend(instanceProps, classProps);
