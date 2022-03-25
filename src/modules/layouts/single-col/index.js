define(function(require) {

  var $ = require('jquery');
  require('jquery-cookie');

  var Submissions = require('modules/components/submissions/collection');
  var SubmissionsView = require('modules/components/submissions/collection-view');
  var WelcomeMessageView = require('modules/components/helpers/welcome-view');


  return function() {
    var self = this;

    var submissions = new Submissions();

    var shouldShowWelcome = $.cookie('welcomeClosed');

    if (typeof shouldShowWelcome === "undefined") {
      var welcomeView = self.addSubView({
        viewType: WelcomeMessageView,
        container: '#about',
        options : {
          user: self.user
        }
      });

      welcomeView.on('welcome:close', function(ev) {
        $.cookie('welcomeClosed', true, { expires: 7 });
      });
    }

    submissions.fetch().then(function() {

      // add submissions gallery
      var indexView = self.addSubView({
        viewType : SubmissionsView,
        container: '.content',
        options: {
          collection: submissions
        }
      });

      self._enableNavEvents(indexView);
    });
  };
});
