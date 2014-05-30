define(function(require) {
  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/layouts/single-col');
  var API = require("src/modules/services/api");
  var flash = require('src/modules/core/flash');
  var $ = require('jquery');

  // views: index page
  var SubmissionsView = require('src/modules/components/submissions/collection-view');
  var Submissions = require('src/modules/components/submissions/collection');

  // views: add page
  var SubmissionAddView = require('src/modules/components/submissions/add-view');
  var Submission = require('src/modules/components/submissions/model');

  // views: show page
  var SubmissionShowView = require('src/modules/components/submissions/show-view');

  // views: tag submissions gallery show
  var Tag = require('src/modules/components/tags/model');
  var BreadcrumbsView = require('src/modules/components/helpers/breadcrumbs');

  // views: comments for submission show
  var SubmissionComments = require('src/modules/components/comments/collection');
  var SubmissionCommentsView = require('src/modules/components/comments/collection-view');

  // views: user submissions
  var User = require('src/modules/components/users/model');

  // views: creator submissions
  var Creator = require('src/modules/components/creators/model');

  return BaseView.extend({
    template: template,
    initialize: function(options) {
      options = options || {};
      this.user = options.user;
      this.page = options.page || "index";
      this.options = options.options || {};
    },

    _enableNavEvents: function(view) {
      var self = this;

      view.on('submission:show', function(id) {
        self.trigger('submission:show', id);
      });

      view.on('tag:show', function(id) {
        self.trigger('tag:show', id);
      });

      view.on('creator:show', function(id) {
        self.trigger('creator:show', id);
      });

      view.on('user:show', function(id) {
        self.trigger('user:show', id);
      });
    },

    postRender: function() {
      if (this.page === "index") {
        this.postRenderIndex();
        return;
      }
      if (this.page === "add") {
        this.postRenderAdd();
        return;
      }
      if (this.page === "show") {
        this.postRenderShow();
        return;
      }
      if (this.page === "tagSubmissionShow") {
        this.postRenderTagSubmissionShow();
        return;
      }
      if (this.page === "showUserSubmissions") {
        this.postRenderShowUserSubmissions();
        return;
      }
      if (this.page === "showCreatorSubmissions") {
        this.postRenderShowCreatorSubmissions();
        return;
      }
    },

    // index page
    postRenderIndex: function() {
      var self = this;

      var submissions = new Submissions();

      submissions.fetch().then(function() {

        // add submissions gallery
        var indexView = self.addSubView({
          viewType : SubmissionsView,
          container: '.content',
          options: {
            collection: submissions
          }
        });

        self._enableNavEvents(indexView);
      });
    },

    // add page
    postRenderAdd: function() {

      var self = this;

      var addView = self.addSubView({
        viewType: SubmissionAddView,
        container: '.content',
        options: {
          model : new Submission()
        }
      });

      addView.on('created', function(submission) {
        self.trigger('submission:created', submission);
      });

      addView.on('error', function(response) {
        if (typeof response === "string") {
          flash.display(response);
        } else {
          if (response.message) {
            flash.display(response.message);
          } else if (response.errors) {
            flash.display(response.errors.map(function(e) {
              return e.message;
            }).join("<br>"));
          } else {
            flash.display("Unknown Error");
          }
        }
      });
    },

    postRenderShow: function(options) {
      var self = this;
      var def = $.Deferred();

      var showView;
      new Submission({ id : self.options.id })
        .fetch()
        .then(function(submission) {
          showView = self.addSubView({
            viewType : SubmissionShowView,
            container: '.content',
            options: {
              model : new Submission(submission),
              user: self.user
            }
          });

          self._enableNavEvents(showView);

          def.resolve(showView);
        });

      new SubmissionComments({ submission_id : self.options.id })
        .fetch()
        .then(function(comments) {
          $.when(def.promise()).then(function(showView) {
            showView.addSubView({
              viewType: SubmissionCommentsView,
              container: '.extra',
              options: {
                submission_id : self.options.id,
                collection: new SubmissionComments(comments),
                user: self.user,
                loggedIn: self.user ? true : false
              }
            });
          });
        });
    },

    postRenderTagSubmissionShow: function() {
      var self = this;
      var tag = new Tag({ id : self.options.id });
      tag.fetch()
        .then(function() {

          // add breadcrumbs details
          self.addSubView({
            viewType: BreadcrumbsView,
            container: '#breadcrumbs',
            options: {
              tag : tag
            }
          }).render().place();

          // add submissions gallery
          var indexView = self.addSubView({
            viewType : SubmissionsView,
            container: '.content',
            options: {
              collection: tag.get('submissions')
            }
          });

          self._enableNavEvents(indexView);

        });
    },

    postRenderShowUserSubmissions: function() {
      var self = this;
      var twitter_handle = this.options.twitter_handle;
      var user = new User({
        twitter_handle : twitter_handle
      });

      user.fetch().then(function() {

        // add breadcrumbs details
        self.addSubView({
          viewType: BreadcrumbsView,
          container: '#breadcrumbs',
          options: {
            twitter_handle : twitter_handle
          }
        }).render().place();

        // add submissions gallery
        var indexView = self.addSubView({
          viewType : SubmissionsView,
          container: '.content',
          options: {
            collection: user.get('submissions')
          }
        });

        self._enableNavEvents(indexView);
      });
    },

    postRenderShowCreatorSubmissions: function() {
      var self = this;
      var creator = this.options.creator;
      var user = new Creator({
        creator : creator
      });

      user.fetch().then(function() {

        // add breadcrumbs details
        self.addSubView({
          viewType: BreadcrumbsView,
          container: '#breadcrumbs',
          options: {
            creator : creator
          }
        }).render().place();

        // add submissions gallery
        var indexView = self.addSubView({
          viewType : SubmissionsView,
          container: '.content',
          options: {
            collection: user.get('submissions')
          }
        });

        self._enableNavEvents(indexView);
      });
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