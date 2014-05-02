define(function(require) {
  var Backbone = require('backbone');
  var moment = require('moment');
  var API = require("src/modules/services/api");

  return Backbone.Model.extend({
    url : function() {
      return API.submissions.show + this.get('id');
    },

    toJSON: function() {
      var attrs = Backbone.Model.prototype.toJSON.apply(this);

      attrs.timestamp = moment(attrs.timestamp).fromNow();
      return attrs;
    }
  });
});