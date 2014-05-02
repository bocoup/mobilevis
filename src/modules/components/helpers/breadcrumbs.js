define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/helpers/breadcrumbs');

  return BaseView.extend({
    template: template,

    serialize: function() {
      return {
        tag : this.model.toJSON()
      };
    }
  });

});