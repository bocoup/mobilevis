const BaseModel = require('../base/model');

var instanceProps = {
  tableName: 'submissions',
  images: function () {
    return this.hasMany(require('./image'));
  },
  tags: function () {
    return this.hasMany(require('./tag'))
      .through(require('./submission_tag'));
  },
  comments: function () {
    return this.hasMany(require('./comment'));
  }
};

var classProps = {
  fields: [
    'id',
    'twitter_handle',
    'name',
    'creator',
    'original_url',
    'timestamp',
    'is_published'
  ],
  links: ['images', 'tags', 'comments']
};

module.exports = BaseModel.extend(instanceProps, classProps);
