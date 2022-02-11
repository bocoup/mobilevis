define(function(require) {

  var AboutView = require('src/modules/components/helpers/about');

  return function() {
    var self = this;

    // add breadcrumbs details
    var aboutView = self.addSubView({
      viewType: AboutView,
      container: '.content'
    }).render().place();

    self._enableNavEvents(aboutView);
  };
});
