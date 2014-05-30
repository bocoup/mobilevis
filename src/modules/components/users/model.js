define(function(require) {
  var Backbone = require('backbone');
  var API = require("src/modules/services/api");

  var SubmissionsCollection = require('src/modules/components/submissions/collection');
  return Backbone.Model.extend({

    initialize: function(options) {
      if (!options || !options.twitter_handle) {
        throw new Error("Twitter handle required");
      }
      this.twitter_handle = options.twitter_handle;
    },

    parse: function(data) {
      data.submissions = new SubmissionsCollection(data.submissions);
      return data;
    },

    url : function() {
      return API.user.submissions(this.twitter_handle);
    }
  });
});