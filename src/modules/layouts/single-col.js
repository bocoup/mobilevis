define(function(require) {
  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/layouts/single-col');
  var API = require("src/modules/services/api");

  return BaseView.extend({
    template: template,
    initialize: function(options) {
      options = options || {};
      this.user = options.user;
      console.log(this.user);
    },
    postRender: function() {

    },
    serialize: function() {
      return {
        loggedIn: this.user ? true : false,
        user: this.user,
        routes: API
      };
    }
  });
});