define(function(require) {
  var Backbone = require('backbone');
  var API = require("modules/services/api");

  var SubmissionsCollection = require('modules/components/submissions/collection');
  return Backbone.Model.extend({

    initialize: function(options) {
      if (!options || !options.creator) {
        throw new Error("Creator required");
      }
      this.creator = options.creator;
    },

    parse: function(data) {
      data.submissions = new SubmissionsCollection(data.submissions);
      return data;
    },

    url : function() {
      return API.creator.submissions(this.creator);
    }
  });
});
