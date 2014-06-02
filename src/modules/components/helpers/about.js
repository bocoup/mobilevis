define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/helpers/about');

  return BaseView.extend({
    template: template
  });

});