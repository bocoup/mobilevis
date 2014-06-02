define(function(require) {

  var BreadcrumbsView = require('src/modules/components/helpers/breadcrumbs');
  var SubmissionsView = require('src/modules/components/submissions/collection-view');
  var Creator = require('src/modules/components/creators/model');

  return function() {
    var self = this;
    var creator = this.options.creator;
    var user = new Creator({
      creator : creator
    });

    user.fetch().then(function() {

      // add breadcrumbs details
      self.addSubView({
        viewType: BreadcrumbsView,
        container: '#breadcrumbs',
        options: {
          creator : creator
        }
      }).render().place();

      // add submissions gallery
      var indexView = self.addSubView({
        viewType : SubmissionsView,
        container: '.content',
        options: {
          collection: user.get('submissions')
        }
      });

      self._enableNavEvents(indexView);
    });
  };
});