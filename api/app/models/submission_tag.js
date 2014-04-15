const BaseModel = require('../base/model');

var instanceProps = {
  tableName: 'submission_tags',
  submission: function () {
    return this.hasOne(require('./submission'));
  },
  tag: function () {
    return this.hasOne(require('./tag'));
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
