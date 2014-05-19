define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/comments/collection-view');

  return BaseView.extend({
    template: template,

    initialize: function(options) {
      this.listenTo(this.collection, "add remove update reset", this.render);
      this.user = options.user;
      this.loggedIn = options.loggedIn;
    },

    serialize: function() {
      return {
        comments: this.collection.toJSON(),
        loggedIn: this.loggedIn,
        user: this.user
      };
    }
  });
});