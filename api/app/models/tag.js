const BaseModel = require('../base/model');

var instanceProps = {
  tableName: 'tags',
  submissions: function () {
    return this.belongsToMany(require('./submission'), 'submission_tags');
  },
};

var classProps = {
  fields: [
    'id',
    'tag',
    'timestamp'
  ],
  byName: function(name) {
    return this.collection().query(function() {
      this.where({ tag : name });
    }).fetchOne();
  }
};

module.exports = BaseModel.extend(instanceProps, classProps);
