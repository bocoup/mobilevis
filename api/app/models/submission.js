const _ = require('lodash');

const BaseModel = require('../base/model');
const Tag = require('./tag');
const SubmissionTag = require('./submission_tag');
const SubmissionImage = require('./image');
const when = require('when');
const Validator = require('validator');
const sequence = require('when/sequence');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const RSS = require('rss');
const UrlDetails = require('../../config/twitter');

var chai = require("chai");
var assert = chai.assert;

// sanitize all the things. These are the tags that are allowed
// for the content of text fields.
var textFieldOpts = {
   allowedTags: [ 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li' ]
};
var inputFieldOpts = {
  allowedTags: []
};

var instanceProps = {
  tableName: 'submissions',

  /**
   * A submission has many images: 1..*
   * @return {Relation}
   */
  images: function () {
    return this.hasMany(require('./image'));
  },

  /**
   * A submission has many tags, through the submission tags table: 1..*
   * @return {Relation}
   */
  tags: function () {
    return this.belongsToMany(require('./tag'))
      .through(require('./submission_tag'));
  },

  /**
   * A submission has many comments: 1..*
   * @return {Relation}
   */
  comments: function () {
    return this.hasMany(require('./comment'));
  },

  /**
   * Tags a submission with a certain tag name, if it doesn't already exist.
   * @param  {String} tagName
   * @return {Promise}
   */
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

  /**
   * Serializes a submission
   * @return {Object} json
   */
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

/**
 * Class properties
 * @type {Object}
 */
var classProps = {
  fields: [
    'id',
    'twitter_handle',
    'name',
    'creator',
    'description',
    'original_url',
    'timestamp',
    'is_published'
  ],
  links: ['images', 'tags', 'comments'],

  /**
   * Finds a submission by name
   * @param  {String} name
   * @param  {[Object]} opts
   * @return {Promise}
   */
  findByName: function(name, opts) {
    return this.forge({ name : name }).fetch(opts||{});
  },

  /**
   * Generates an RSS feed
   * @param {String} writeTo The path to write the RSS feed to.
   * @return {Promise}
   */
  generateFeed: function(writeTo) {
    var def = when.defer();
    var feed = new RSS({
      title: "MobileVis Gallery",
      description: "Examples of Data Visualization on Mobile Devices",
      feed_url: UrlDetails.redirect_host + "/rss.xml",
      site_url: UrlDetails.redirect_host,
      image_url: UrlDetails.redirect_host + "/src/assets/mobilevis-logo.png",
      author: "Irene Ros",
      webMaster: "Irene Ros",
      copyright: "2014 Irene Ros",
      language: "en",
      pubDate: new Date(),
      ttl: "3600"
    });

    this.collection().query(function(qb) {
      qb.orderBy('timestamp', 'desc');
    }).fetch().then(function(submissions) {
      submissions.models.forEach(function(s) {
        var sub = s.attributes;
        feed.item({
          title: sub.name,
          description: sub.description,
          url: UrlDetails.redirect_host + '/submission/' + sub.id,
          guid: sub.id,
          author: sub.twitter_handle,
          date: sub.timestamp
        });
      });

      var xml = feed.xml();
      fs.writeFile(writeTo, xml, function(err) {
        if (err) { def.reject(err); }
        def.resolve(writeTo);
      });
    }, function(err) {
      def.reject(err);
    });

    return def.promise;
  },

  /**
   * Updates a submission
   * @param  {Object} submission Submission to Update
   * @param  {Object} props New Properties
   * @return {Promise}
   */
  update: function(submission, props) {
    var def = when.defer();

    try {
      // validate props
      assert.isDefined(props.name, "name is required");
      assert.isDefined(props.twitter_handle, "twitter_handle is required");
      assert.isDefined(props.creator, "creator is required");
      assert.isDefined(props.original_url, "original_url is required");
      assert(Validator.isURL(props.original_url), "original_url isn't a URL");

      // sanitize all the things
      if (props.description) {
        props.description = sanitizeHtml(props.description, textFieldOpts);
      }

      props.name = sanitizeHtml(props.name, inputFieldOpts);
      props.creator = sanitizeHtml(props.creator, inputFieldOpts);


      // TODO: DEAL WITH TAGS LATA;
      var tags = props.tags;
      var previous_tags = JSON.parse(props.previous_tags);
      delete props.tags;
      delete props.previous_tags;

      // ====
      // Go through previous tags. If there are any that don't exist in
      // current tags, delete those submission_tags.
      if (_.isString(tags)) {
        tags = tags.split(",").map(function(tag) {
          return tag.trim();
        });
      }

      var changes = [];
      previous_tags.forEach(function(previous_tag) {
        if (tags.indexOf(previous_tag.tag) === -1) {
          changes.push(function() {
            return new SubmissionTag({
              submission_id : submission.id,
              tag_id : previous_tag.id
            }).fetch().then(function(s) {
              return s.destroy();
            }, function(err) {
              def.reject(err);
            });
          });
        }
      });

      // =====
      // Go through new tags. If there are any that don't exist in previous
      // tags, then create them.
      var previous_tags_array = previous_tags.map(function(t) {
        return t.tag;
      });

      tags.forEach(function(new_tag) {
        if (previous_tags_array.indexOf(new_tag) === -1) {
          changes.push(function() {
            return submission.tagAs(new_tag);
          });
        }
      });

      // try to save now.
      submission.save(props, { patch: true })
        .then(function(fullSubmission) {
          sequence(changes).then(function() {
            def.resolve(fullSubmission);
          }, function(err) {
            def.reject(err);
          });
        }, function(err) {
          def.reject(err);
        });

    } catch(e) {
      def.reject(e);
    }

    return def.promise;
  },

  /**
   * Adds a new submission
   * @param {Object} props Submission details.
   */
  add : function(props) {

    var self = this;
    var def = when.defer();
    var checkExistance = when.defer();
    var tagDef = when.defer();

    try {

      // if we have an original url, make sure it's a url
      if (props.original_url && props.original_url.length) {
        assert(Validator.isURL(props.original_url), "original_url isn't a URL");

        // check if this already exists, based on URL. if it does, exit.
        self.forge({ original_url : props.original_url }).fetch().then(function(submission) {
          console.log(submission);
          if (typeof submission !== "undefined" && submission !== null) {
            checkExistance.reject("This example already exists. Id " + submission.id);
          } else {
            checkExistance.resolve();
          }
        });
      }

      checkExistance.promise.then(function() {

        // validate props
        assert.isDefined(props.name, "name is required");
        assert.isDefined(props.twitter_handle, "twitter_handle is required");
        assert.isDefined(props.creator, "creator is required");
        assert.isDefined(props.original_url, "original_url is required");
        assert.isDefined(props.images, "images are required");
        assert.isArray(props.images, "images should be defined");
        assert.isTrue(props.images.length > 0, "at least one image is required");

        props.is_published = true;

        // sanitize all the things
        if (props.description) {
          props.description = sanitizeHtml(props.description, textFieldOpts);
        }

        props.name = sanitizeHtml(props.name, inputFieldOpts);
        props.creator = sanitizeHtml(props.creator, inputFieldOpts);

        // if we have any tags, make sure the exist
        // create the ones that don't, and substitute
        // the whole array with ids.
        if (props.tags && props.tags.length) {

          var tagSaving = [];
          var tags = [];

          // sanitize tags
          props.tags = sanitizeHtml(props.tags, inputFieldOpts);

          if (typeof props.tags === "string") {
            props.tags = props.tags.split(",");
          }

          // save all tags
          props.tags.forEach(function(tag) {

            // sanitizing might reduce the tag to nothing, so just drop it.
            if (tag.trim().length) {
              tagSaving.push(function() {
                return Tag.findOrCreate({
                  tag : tag.trim()
                });
              });
            }
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

      }, function(err) {
        def.reject(err);
      }); // checkExistance deferred.
    } catch (e) {
      def.reject(e);
    }

    return def.promise;
  }
};

module.exports = BaseModel.extend(instanceProps, classProps);
