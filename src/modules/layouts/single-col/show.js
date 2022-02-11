define(function(require) {

  var $ = require('jquery');

  var Submission = require('src/modules/components/submissions/model');
  var SubmissionShowView = require('src/modules/components/submissions/show-view');
  var SubmissionComments = require('src/modules/components/comments/collection');
  var SubmissionCommentsView = require('src/modules/components/comments/collection-view');

  return function(options) {
    var self = this;
    var def = $.Deferred();

    var showView;
    new Submission({ id : self.options.id })
      .fetch()
      .then(function(submission) {
        showView = self.addSubView({
          viewType : SubmissionShowView,
          container: '.content',
          options: {
            model : new Submission(submission),
            user: self.user
          }
        });

        self._enableNavEvents(showView);

        def.resolve(showView);
      });

    new SubmissionComments({ submission_id : self.options.id })
      .fetch()
      .then(function(comments) {
        $.when(def.promise()).then(function(showView) {
          showView.addSubView({
            viewType: SubmissionCommentsView,
            container: '.extra',
            options: {
              submission_id : self.options.id,
              collection: new SubmissionComments(comments),
              user: self.user,
              loggedIn: self.user ? true : false
            }
          });
        });
      });
  };
});
