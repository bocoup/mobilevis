define(function(require) {
  var Backbone = require('backbone');
  var Submission = require('modules/components/submissions/model');

  var API = require("modules/services/api");

  return Backbone.Collection.extend({
    model: Submission,
    url : function() {
      return API.submissions.all;
    }
  });

});
