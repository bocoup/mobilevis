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
      "add": "add",
      "submission/:id": "show"
    },

    index: function() {
      var self = this;

      Session.getProfile().always(function(user) {
        self.currentLayout = new SingleColLayout({
          el: "#main",
          user: user,
          page: "index"
        }).render().place();

        self.currentLayout.on('submission:show', function(submission_id) {
          self.navigate('submission/' + submission_id, { trigger : true });
        });
      });
    },

    add: function() {
      var self = this;

      Session.getProfile().then(function(user) {
        self.currentLayout = new SingleColLayout({
          el: "#main",
          user: user,
          page: "add"
        }).render().place();

        self.currentLayout.on('submission:created', function(submission) {
          // TODO: navigate to individual submission rather than index.
          self.navigate('', { trigger: true });
        });
      });
    },

    show: function(id) {
      var self = this;
      Session.getProfile().always(function(user) {
        self.currentLayout = new SingleColLayout({
          el: "#main",
          user: user,
          page: "show",
          options: {
            id : id
          }
        }).render().place();
      });
    }

  });

  return new Router();
});