define(function(require){
  "use strict";

  var Backbone = require("backbone");

  var SingleColLayout = require("src/modules/layouts/single-col");
  var Session = require("src/modules/core/session");

  var Router = Backbone.Router.extend({
    initialize: function() {
      this.currentLayout = null;
    },

    routes: {
      "" : "index",
      "add": "add"
    },

    index: function() {
      var self = this;

      Session.getProfile().always(function(user) {
        self.currentLayout = new SingleColLayout({
          el: "#main",
          user: user,
          page: "index"
        }).render().place();
      });
    },

    add: function() {
      Session.getProfile().then(function(user) {
        new SingleColLayout({
          el: "#main",
          user: user,
          page: "add"
        }).render().place();
      });
    }

  });

  return new Router();
});