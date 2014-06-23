const BaseModel = require('../classes/model');

/**
 * Instance properties for a submission tag, a link table
 * between submissions and their tags.
 * @type {Object}
 */
var instanceProps = {
  tableName: 'submission_tags',

  /**
   * A submission tag belongs to a single submisson: 1..1
   * @return {Relation}
   */
  submission: function () {
    return this.belongsTo(require('./submission'));
  },

  /**
   * A submission tag belongs to a single tag: 1..1
   * @return {Relation}
   */
  tag: function () {
    return this.belongsTo(require('./tag'));
  }
};

var classProps = {
  fields: [
    'id',
    'submission_id',
    'tag_id',
    'timestamp'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
