const BaseModel = require('../base/model');

var instanceProps = {
  tableName: 'submission_tags',
  submission: function () {
    return this.belongsTo(require('./submission'));
  },
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
