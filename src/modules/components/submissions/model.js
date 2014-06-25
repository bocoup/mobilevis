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

      if (attrs.timestamp) {
        attrs.timestamp = moment(attrs.timestamp).fromNow();
      } else {
        attrs.timestamp = moment().fromNow();
      }

      attrs.main_image = null;

      if (attrs.images && attrs.images.length > 0) {
        // find preview image, or make the first one the preview image.
        attrs.main_image = attrs.images.filter(function(i) {
          return i.isPreview === true;
        });

        if (attrs.main_image.length === 0) {
          attrs.main_image = attrs.images[0];
        } else {
          attrs.main_image = attrs.main_image[0];
        }
      }

      return attrs;
    }
  });
});