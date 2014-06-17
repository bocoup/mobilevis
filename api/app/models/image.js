const BaseModel = require('../base/model');

/**
 * Image instance properties. A submission has many images.
 * @type {Object}
 */
var instanceProps = {
  tableName: 'images',

  /**
   * Many images belong to a single submission (*..1)
   * @return {Relation}
   */
  submission: function () {
    return this.belongsTo(require('./submission'));
  }
};

/**
 * Class properties for an Image
 * @type {Object}
 */
var classProps = {
  fields: [
    'id',
    'submission_id',
    'url',
    'timestamp'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
