const BaseModel = require('../base/model');
const when = require('when');

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
  ],

  update: function(image, newProps) {
    var def = when.defer();

    image.save(newProps, { patch: true }).then(function(image) {
      def.resolve(image);
    }, function(err) {
      def.reject(err);
    });

    return def.promise;
  }
};

module.exports = BaseModel.extend(instanceProps, classProps);
