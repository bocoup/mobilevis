define(function(require) {
  var Backbone = require('backbone');
  var Model = require('modules/components/comments/model');
  var moment = require('moment');


  // var moment = require('moment');
  var API = require("modules/services/api");

  return Backbone.Collection.extend({

    model : Model,

    initialize: function(options) {
      this.submission_id = options.submission_id;
    },

    url : function() {
      return API.comments.submission(this.submission_id);
    },

    comparator: function(model) {
      return -(+moment(model.get('timestamp')).format('X'));
    }
  });
});
