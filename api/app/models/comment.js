const BaseModel = require('../classes/model');
const when = require('when');
const Validator = require('validator');
const moment = require('moment');
const sanitizeHtml = require('sanitize-html');

const chai = require("chai");
const assert = chai.assert;

/**
 * Comment instance properties
 * @type {Object}
 */
var instanceProps = {
  tableName: 'comments',

  /**
   * Many comments belong to a single submission: *..1
   * @return {Relation}
   */
  submission: function () {
    return this.belongsTo(require('./submission'));
  }
};

/**
 * Class properties for Comment model.
 * @type {Object}
 */
var classProps = {
  fields: [
    'id',
    'twitter_handle',
    'comment',
    'submission_id',
    'timestamp'
  ],

  /**
   * Finds comments for a submission
   * @param  {Object} props Must contain submission_id.
   * @return {Promise}
   */
  findBySubmissionId: function(props) {
    return this.collection().query({
      where : { submission_id : props.submission_id }
    }).fetch();
  },

  /**
   * Adds a comment
   * Props must contain:
   *   - twitter_handle
   *   - comment
   *   - submission_id
   * @param {Object} props
   * @returns {Promise}
   */
  add: function(props) {
    var self = this;
    var def = when.defer();

    try {

      // validate props
      assert.isDefined(props.twitter_handle, "twitter_handle is required");
      assert.isDefined(props.comment, "comment is required");

      // sanitize content
      props.comment = sanitizeHtml(props.comment, {
         allowedTags: [ 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li' ]
      });

      // verify comment still exists after sanitization.
      assert.isDefined(props.comment.length > 0, "comment is required");

      // create new comment
      props.timestamp = moment().format('MM DD YYYY HH:mm:ss');

      self.create(props).then(function(comment) {
        def.resolve(comment);
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
