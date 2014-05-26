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

  return BaseView.extend({
    template: template,
    initialize: function(options) {
      options = options || {};
      this.user = options.user;
      this.page = options.page || "index";
      this.options = options.options || {};
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

        indexView.on('submission:show', function(id) {
          self.trigger('submission:show', id);
        });

        indexView.on('tag:show', function(id) {
          self.trigger('tag:show', id);
        });
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
        flash.display(response.message || response.errors.map(function(e) {
          return e.message;
        }).join("<br>"));
      });
    },

    postRenderShow: function(options) {
      var self = this;
      var def = $.Deferred();

      new Submission({ id : self.options.id })
        .fetch()
        .then(function(submission) {
          var showView = self.addSubView({
            viewType : SubmissionShowView,
            container: '.content',
            options: {
              model : new Submission(submission)
            }
          });

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
              model : tag
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

          indexView.on('tag:show', function(id) {
            self.trigger('tag:show', id);
          });

          indexView.on('submission:show', function(id) {
            self.trigger('submission:show', id);
          });


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