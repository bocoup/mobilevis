define(function(require) {

  var Submission = require('src/modules/components/submissions/model');
  var SubmissionEditView = require('src/modules/components/submissions/edit-view');
  var flash = require('src/modules/core/flash');

  return function() {
    var self = this;

    var submission = new Submission({ id : self.options.id });
    submission.fetch().then(function() {
      var editView = self.addSubView({
        viewType: SubmissionEditView,
        container: '.content',
        options: {
          model: submission
        }
      });

      self._enableNavEvents(editView);

      editView.on('updated', function(submission) {
        self.trigger('submission:updated', submission);
      });

      editView.on('error', function(response) {
        if (typeof response === "string") {
          flash.display(response);
        } else {
          if (response.message) {
            flash.display(response.message);
          } else if (response.errors) {
            flash.display(response.errors.map(function(e) {
              return e.message;
            }).join("<br>"));
          } else {
            flash.display("Unknown Error");
          }
        }
      });
    });
  };
});
