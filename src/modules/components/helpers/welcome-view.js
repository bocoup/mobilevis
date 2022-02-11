define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/helpers/welcome-view');

  return BaseView.extend({
    template: template,

    events : {
      'click .close' : 'close'
    },

    initialize: function(options) {
      options = options || {};
      if (options.user) {
        this.user = options.user;
      }
    },

    serialize: function() {
      return {
        user: this.user
      };
    },

    close: function(ev) {
      this.$el.fadeOut();
      this.trigger('welcome:close');
      return false;
    }
  });

});
