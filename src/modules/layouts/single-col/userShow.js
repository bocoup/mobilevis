define(function(require) {

  var BreadcrumbsView = require('src/modules/components/helpers/breadcrumbs');
  var SubmissionsView = require('src/modules/components/submissions/collection-view');
  var User = require('src/modules/components/users/model');

  return function() {
    var self = this;
    var twitter_handle = this.options.twitter_handle;
    var user = new User({
      twitter_handle : twitter_handle
    });

    user.fetch().then(function() {

      // add breadcrumbs details
      self.addSubView({
        viewType: BreadcrumbsView,
        container: '#breadcrumbs',
        options: {
          twitter_handle : twitter_handle
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
