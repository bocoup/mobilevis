const BaseModel = require('../classes/model');

/**
 * Instance properties for a tag
 * @type {Object}
 */
var instanceProps = {
  tableName: 'tags',

  /**
   * A tag can belong to many submissions through submission tags: 1..*
   * @return {Relation}
   */
  submissions: function () {
    return this.belongsToMany(require('./submission'), 'submission_tags');
  },

  /**
   * Serialized form of a tag
   * @return {Object}
   */
  toJSON: function() {
    var result = BaseModel.prototype.toJSON.apply(this);
    delete result.timestamp;
    return result;
  }
};

/**
 * Class properties
 * @type {Object}
 */
var classProps = {
  fields: [
    'id',
    'tag',
    'timestamp'
  ],

  /**
   * Finds tags by name
   * @param  {String} name
   * @return {Promise}
   */
  byName: function(name) {
    return this.collection().query(function() {
      this.where({ tag : name });
    }).fetchOne();
  }
};

module.exports = BaseModel.extend(instanceProps, classProps);
