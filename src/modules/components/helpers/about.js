define(function(require) {

  var BaseView = require('modules/core/base-view');
  var template = require('tmpl!modules/components/helpers/about');

  return BaseView.extend({
    template: template
  });

});
