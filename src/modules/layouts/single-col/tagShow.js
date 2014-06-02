define(function(require) {

  var Tag = require('src/modules/components/tags/model');
  var BreadcrumbsView = require('src/modules/components/helpers/breadcrumbs');
  var SubmissionsView = require('src/modules/components/submissions/collection-view');

  return function() {
    var self = this;
    var tag = new Tag({ id : self.options.id });
    tag.fetch()
      .then(function() {

        // add breadcrumbs details
        self.addSubView({
          viewType: BreadcrumbsView,
          container: '#breadcrumbs',
          options: {
            tag : tag
          }
        }).render().place();

        // add submissions gallery
        var indexView = self.addSubView({
          viewType : SubmissionsView,
          container: '.content',
          options: {
            collection: tag.get('submissions')
          }
        });

        self._enableNavEvents(indexView);

      });
  };
});