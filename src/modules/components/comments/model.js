define(function(require) {
  var Backbone = require('backbone');
  var moment = require('moment');

  return Backbone.Model.extend({

    toJSON: function() {
      var attrs = Backbone.Model.prototype.toJSON.apply(this);
      console.log(attrs.timestamp);
      attrs.timestamp = moment(attrs.timestamp).fromNow();
      return attrs;
    }
  });
});