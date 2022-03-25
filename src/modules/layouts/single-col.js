define(function(require) {
  var BaseView = require('modules/core/base-view');
  var template = require('tmpl!modules/layouts/single-col');
  var API = require("modules/services/api");
  // var flash = require('modules/core/flash');
  //var $ = require('jquery');

  // ==== sub layouts ====
  var IndexFunction = require('modules/layouts/single-col/index');
  var AddFunction = require('modules/layouts/single-col/add');
  var EditFunction = require('modules/layouts/single-col/edit');

  // == show
  var ShowFunction = require('modules/layouts/single-col/show');
  var TagIndexFunction = require('modules/layouts/single-col/tagShow');
  var UserIndexFunction = require('modules/layouts/single-col/userShow');
  var CreatorIndexFunction = require('modules/layouts/single-col/creatorShow');
  var AboutFunction = require('modules/layouts/single-col/about');


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

      view.on('submission:edit', function(id) {
        self.trigger('submission:edit', id);
      });

      view.on('submission:delete', function(id) {
        self.trigger('submission:delete', id);
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
      if (this.page === "edit") {
        this.postRenderEdit();
        return;
      }
      if (this.page === "show") {
        this.postRenderShow();
        return;
      }
      if (this.page === "tagSubmissionShow") {
        this.postRenderTagSubmissionIndex();
        return;
      }
      if (this.page === "showUserSubmissions") {
        this.postRenderUserSubmissionsIndex();
        return;
      }
      if (this.page === "showCreatorSubmissions") {
        this.postRenderCreatorSubmissionsIndex();
        return;
      }
      if (this.page === "about") {
        this.postRenderAbout();
        return;
      }
    },

    // index page
    postRenderIndex: IndexFunction,

    // submission
    postRenderShow: ShowFunction,

    // add page
    postRenderAdd: AddFunction,

    // edit submission page
    postRenderEdit: EditFunction,

    // index, by tag
    postRenderTagSubmissionIndex: TagIndexFunction,

    // index, by user
    postRenderUserSubmissionsIndex: UserIndexFunction,

    // index, by creator
    postRenderCreatorSubmissionsIndex: CreatorIndexFunction,

    // about page
    postRenderAbout: AboutFunction,

    serialize: function() {
      return {
        loggedIn: this.user ? true : false,
        user: this.user,
        routes: API
      };
    }
  });
});
