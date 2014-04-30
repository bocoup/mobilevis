define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/submissions/collection-view');

  return BaseView.extend({
    template: template,
    tagName: 'ul',
    className: 'submissions',

    initialize: function() {
      this.listenTo(this.collection, "add remove update reset", this.render);
    },

    serialize: function() {
      return {
        submissions: this.collection.toJSON()
      };
    }
  });
});