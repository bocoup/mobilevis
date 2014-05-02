define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/submissions/show-view');

  return BaseView.extend({
    template: template,

    serialize: function() {
      return {
        submission: this.model.toJSON()
      };
    }

  });
});