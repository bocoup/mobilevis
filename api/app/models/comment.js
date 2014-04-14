const BaseModel = require('../base/model');

var instanceProps = {
  tableName: 'comments',
  submission: function () {
    return this.belongsTo(require('./submission'));
  }
};

var classProps = {
  fields: [
    'id',
    'twitter_handle',
    'comment',
    'submission_id',
    'timestamp'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
