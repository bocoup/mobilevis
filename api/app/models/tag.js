const BaseModel = require('../base/model');

var instanceProps = {
  tableName: 'tags',
  submissions: function () {
    return this.belongsToMany(require('./submission'))
      .through(require('./submission_tag'));
  },
};

var classProps = {
  fields: [
    'id',
    'tag',
    'timestamp'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
