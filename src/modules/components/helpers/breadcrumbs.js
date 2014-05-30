define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/helpers/breadcrumbs');

  return BaseView.extend({
    template: template,

    initialize: function(options) {
      options = options || {};
      if (options.twitter_handle) {
        this.twitter_handle = options.twitter_handle;
      } else if (options.tag) {
        this.tag = options.tag;
      }
    },

    serialize: function() {
      var data = {};

      if (this.tag) {
        data.tag = this.tag.toJSON();
      } else if (this.twitter_handle) {
        data.twitter_handle = this.twitter_handle;
      }
      return data;
    }
  });

});