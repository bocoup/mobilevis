const BaseModel = require('../base/model');

var instanceProps = {
  tableName: 'images',
  submission: function () {
    return this.belongsTo(require('./submission'));
  }
};

var classProps = {
  fields: [
    'id',
    'submission_id',
    'url',
    'timestamp'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
