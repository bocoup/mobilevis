const BaseModel = require('../base/model');
const Tag = require('./tag');
const SubmissionTag = require('./submission_tag');

var instanceProps = {
  tableName: 'submissions',
  images: function () {
    return this.hasMany(require('./image'));
  },
  tags: function () {
    return this.belongsToMany(require('./tag'))
      .through(require('./submission_tag'));
  },
  comments: function () {
    return this.hasMany(require('./comment'));
  },
  tagAs: function(tagName) {
    var instance = this;

    // find or create tag
    return Tag.findOrCreate({ tag : tagName}).then(function(tag) {
      return SubmissionTag.forge({
        tag_id : tag.attributes.id,
        submission_id: instance.attributes.id
      }).save().then(function(result) {
        return instance;
      });
    });
  },
  toJSON: function() {
    var result = BaseModel.prototype.toJSON.apply(this);
    if (result.is_published === 1) {
      result.is_published = true;
    } else {
      result.is_published = false;
    }
    return result;
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
