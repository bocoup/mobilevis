define(function(require){
  "use strict";

  var Backbone = require("backbone");

  var SingleColLayout = require("src/modules/layouts/single-col");
  var Session = require("src/modules/core/session");

  var Router = Backbone.Router.extend({
    initialize: function() {
      this.currentLayout = null;
    },

    _setCurrentLayout : function(layout) {
      var self = this;
      self.currentLayout = layout;

      self.currentLayout.on('tag:show', function(tag_id) {
        self.navigate('tag/' + tag_id, { trigger : true });
      });

      self.currentLayout.on('submission:show', function(submission_id) {
        self.navigate('submission/' + submission_id, { trigger : true });
      });

      self.currentLayout.on('submission:created', function(submission) {
        // TODO: navigate to individual submission rather than index.
        self.navigate('', { trigger: true });
      });
    },

    routes: {
      "" : "index",
      "add": "add",
      "submission/:id": "show",
      "tag/:id": "tagSubmissionShow"
    },

    index: function() {
      var self = this;

      Session.getProfile().always(function(user) {
        self._setCurrentLayout(new SingleColLayout({
          el: "#main",
          user: user,
          page: "index"
        }).render().place());
      });
    },

    add: function() {
      var self = this;

      Session.getProfile().then(function(user) {
        self._setCurrentLayout(new SingleColLayout({
          el: "#main",
          user: user,
          page: "add"
        }).render().place());
      });
    },

    show: function(id) {
      var self = this;
      Session.getProfile().always(function(user) {
        self._setCurrentLayout(new SingleColLayout({
          el: "#main",
          user: user,
          page: "show",
          options: {
            id : id
          }
        }).render().place());
      });
    },

    tagSubmissionShow: function(id) {
      var self = this;

      Session.getProfile().always(function(user) {
        self._setCurrentLayout(new SingleColLayout({
          el: "#main",
          user: user,
          page: "tagSubmissionShow",
          options: {
            id : id
          }
        }).render().place());
      });
    }


  });

  return new Router();
});