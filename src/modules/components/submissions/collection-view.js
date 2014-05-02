define(function(require) {

  var $ = require('jquery');
  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/submissions/collection-view');

  return BaseView.extend({
    template: template,
    tagName: 'ul',
    className: 'submissions',

    events: {
      "click li" : "show",
      "click .tag" : "showTagSubmissions"
    },

    initialize: function() {
      this.listenTo(this.collection, "add remove update reset", this.render);
    },

    serialize: function() {
      return {
        submissions: this.collection.toJSON()
      };
    },

    show: function(ev) {
      var submission = $(ev.target).closest('li.submission').data('submission-id');
      this.trigger('submission:show', submission);
    },

    showTagSubmissions: function(ev) {
      ev.stopPropagation();
      var tag = $(ev.target).data('tag-id');
      this.trigger('tag:show', tag);
      return false;
    }
  });
});