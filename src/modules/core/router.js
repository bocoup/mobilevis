define(function(require){
  "use strict";

  var Backbone = require("backbone");
  var GA = require("GoogleAnalytics");

  var SingleColLayout = require("modules/layouts/single-col");

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

      self.currentLayout.on('user:show', function(user) {
        self.navigate('user/' + user, { trigger : true });
      });

      self.currentLayout.on('creator:show', function(creator) {
        self.navigate('creator/' + creator, { trigger : true });
      });

      self.currentLayout.on('submission:show', function(submission_id) {
        self.navigate('submission/' + submission_id, { trigger : true });
      });

      self.currentLayout.on('submission:edit', function(submission_id) {
        self.navigate('submission/' + submission_id + '/edit', { trigger : true });
      });

      self.currentLayout.on('submission:delete', function(submission_id) {
        self.navigate('/', { trigger : true });
      });

      self.currentLayout.on('submission:created', function(submission) {
        self.navigate('submission/' + submission.id, { trigger : true });
      });

      self.currentLayout.on('submission:updated', function(submission) {
        self.navigate('submission/' + submission.id, { trigger : true });
      });
    },

    _logActivity: function(pathOrObject) {
      GA.ready(function() {
        GA.view(pathOrObject);
      });
    },

    /**
	 * The original deployment of this application (first launched in 2014) used
	 * HTML pushState and a custom web server to support routes without a
	 * trailing "forward slash" character.
	 *
	 * In 2022, the application was redeployed as a fully-static site hosted on
	 * GitHub Pages. In order to preserve functionality of hyperlinks on the
	 * web while hosted on this simpler system, a build process was introduced
	 * to generate the file system hierarchy suggested by the route
	 * structure. However, the GitHub Pages service provides "redirect"
	 * responses (i.e. HTTP 301) for directory requests without a trailing
	 * forward slash. For this reason, the application must recognize routes
	 * with and without a trailing forward slash.
	 */
    routes: {
      "" : "index",
      "submission/:id(/)": "show",
      "tag/:id(/)": "tagSubmissionShow",
      "user/:twittername(/)" : "showUserSubmissions",
      "creator/:creator(/)" : "showCreatorSubmissions",
      "about(/)" : "about"
    },

    index: function() {
      var self = this;

      self._setCurrentLayout(new SingleColLayout({
        el: "#main",
        page: "index"
      }).render().place());
    },

    show: function(id) {
      var self = this;

      self._logActivity({
        title: "View Submission",
        page: "/submission/" + id
      });

      self._setCurrentLayout(new SingleColLayout({
        el: "#main",
        page: "show",
        options: {
          id : id
        }
      }).render().place());
    },

    showUserSubmissions: function(twitter_handle) {
      var self = this;

      self._logActivity({
        title: "View submissions by user",
        page: "/user/" + twitter_handle
      });

      self._setCurrentLayout(new SingleColLayout({
        el: "#main",
        page: "showUserSubmissions",
        options: {
          twitter_handle: twitter_handle
        }
      }).render().place());
    },

     showCreatorSubmissions: function(creator) {
      var self = this;

      self._logActivity({
        title: "View submissions by creator",
        page: "/creator/" + creator
      });

      self._setCurrentLayout(new SingleColLayout({
        el: "#main",
        page: "showCreatorSubmissions",
        options: {
          creator: creator
        }
      }).render().place());
    },

    tagSubmissionShow: function(id) {
      var self = this;

      self._logActivity({
        title: "View submissions by tag",
        page: "/tag/" + id
      });

      self._setCurrentLayout(new SingleColLayout({
        el: "#main",
        page: "tagSubmissionShow",
        options: {
          id : id
        }
      }).render().place());
    },

    about: function() {
      var self = this;

      self._logActivity({
        title: "View about page",
        page: "/about"
      });

      self._setCurrentLayout(new SingleColLayout({
        el: "#main",
        page: "about"
      }).render().place());
    }
  });

  return new Router();
});
