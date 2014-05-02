define(function(require) {
  var Backbone = require('backbone');
  var API = require("src/modules/services/api");
  var SubmissionCollection = require("src/modules/components/submissions/collection");

  return Backbone.Model.extend({

    url : function() {
      return API.tags.show + this.get('id');
    },

    // overwrite submissions array
    parse: function(data) {
      data.submissions = new SubmissionCollection(data.submissions);
      return data;
    }

  });
});