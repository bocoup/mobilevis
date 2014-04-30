const BaseModel = require('../base/model');
const Tag = require('./tag');
const SubmissionTag = require('./submission_tag');
const SubmissionImage = require('./image');
const when = require('when');
const Validator = require('validator');
const sequence = require('when/sequence');

var chai = require("chai");
var assert = chai.assert;

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
  links: ['images', 'tags', 'comments'],

  findByName: function(name, opts) {
    return this.forge({ name : name }).fetch(opts||{});
  },

  findByTag: function(tag_id) {

  },

  add : function(props) {

    var self = this;
    var def = when.defer();
    var tagDef = when.defer();

    try {

      // validate props
      assert.isDefined(props.name, "name is required");
      assert.isDefined(props.twitter_handle, "twitter_handle is required");
      assert.isDefined(props.creator, "creator is required");
      assert.isDefined(props.original_url, "original_url is required");
      assert.isDefined(props.images, "images are required");
      assert.isArray(props.images, "images should be defined");

      props.is_published = true;

      // if we have an original url, make sure it's a url
      if (props.original_url && props.original_url.length) {
        assert(Validator.isURL(props.original_url), "original_url isn't a URL");
      }

      // if we have any tags, make sure the exist
      // create the ones that don't, and substitute
      // the whole array with ids.
      if (props.tags && props.tags.length) {
        var tagSaving = [];
        var tags = [];

        // save all tags
        props.tags.forEach(function(tag) {
          tagSaving.push(function() { return Tag.findOrCreate({ tag : tag }) });
        });

        sequence(tagSaving).then(function(tags) {
          delete props.tags;
          tagDef.resolve(tags.map(function(t) { return t.attributes.id; }));

        }, function(err) {
          tagDef.reject(err);
        });
      } else {
        tagDef.resolve();
      }

      tagDef.promise.then(function(tag_ids) {

        // save images before saving
        var propImages = props.images;
        delete props.images;

        self.create(props).then(function(submission) {

          // create tags
          var tagAdd = tag_ids.map(function(tag_id) {
            return function() {
              return new SubmissionTag({
                submission_id : submission.attributes.id,
                tag_id: tag_id
              }).save().then(function(t) {
                return t;
              });
            };
          });

          // create images
          var imageAdd = propImages.map(function(image) {
            return function() {
              return new SubmissionImage({
                submission_id : submission.attributes.id,
                url : image
              }).save().then(function(i) {
                return i;
              });
            };
          });

          sequence(tagAdd).then(function(tagsAdded) {
            sequence(imageAdd).then(function(imagesAdded) {

              new self({ id : submission.id }).fetch({
                withRelated : ['tags', 'images']
              }).then(function(fullSubmission) {
                def.resolve(fullSubmission);
              });

            }, function(err) {
              def.reject(err);
            });
          }, function(err) {
            def.reject(err);
          });
        });
      }, function(err) {
        def.reject(err);
      });

    } catch (e) {
      def.reject(e);
    }

    return def.promise;
  }
};

module.exports = BaseModel.extend(instanceProps, classProps);
