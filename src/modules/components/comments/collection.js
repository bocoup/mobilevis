define(function(require) {
  var Backbone = require('backbone');
  var moment = require('moment');
  var API = require("src/modules/services/api");

  return Backbone.Collection.extend({

    initialize: function(options) {
      this.submission_id = options.submission_id;
    },

    url : function() {
      return API.comments.submission(this.submission_id);
    },

    serialize: function() {
      var comments = Backbone.Collection.prototype.toJSON.apply(this);

      comments.forEach(function(comment) {
        comment.timestamp = moment(comment.timestamp).fromNow();
      });

      return comments;
    }
  });
});