define(function(require) {
  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/layouts/single-col');
  var API = require("src/modules/services/api");
  // var flash = require('src/modules/core/flash');
  //var $ = require('jquery');

  // ==== sub layouts ====
  var IndexFunction = require('src/modules/layouts/single-col/index');
  var AddFunction = require('src/modules/layouts/single-col/add');
  var EditFunction = require('src/modules/layouts/single-col/edit');

  // == show
  var ShowFunction = require('src/modules/layouts/single-col/show');
  var TagIndexFunction = require('src/modules/layouts/single-col/tagShow');
  var UserIndexFunction = require('src/modules/layouts/single-col/userShow');
  var CreatorIndexFunction = require('src/modules/layouts/single-col/creatorShow');


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

    serialize: function() {
      return {
        loggedIn: this.user ? true : false,
        user: this.user,
        routes: API
      };
    }
  });
});