const BaseModel = require('../base/model');
const when = require('when');
const Validator = require('validator');

var chai = require("chai");
var assert = chai.assert;

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
  ],

  findBySubmissionId: function(props) {
    return this.collection().query({
      where : { submission_id : props.submission_id }
    }).fetch();
  },

  add: function(props) {
    var self = this;
    var def = when.defer();

    try {

      // validate props
      assert.isDefined(props.comment, "comment is required");
      assert.isDefined(props.twitter_handle, "twitter_handle is required");

      // create new comment
      return self.create(props).then(function(comment) {
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
