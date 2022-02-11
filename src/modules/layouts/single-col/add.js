define(function(require) {

  var SubmissionAddView = require('src/modules/components/submissions/add-view');
  var Submission = require('src/modules/components/submissions/model');
  var flash = require('src/modules/core/flash');

  return function() {

    var self = this;

    var addView = self.addSubView({
      viewType: SubmissionAddView,
      container: '.content',
      options: {
        model : new Submission()
      }
    });

    addView.on('created', function(submission) {
      self.trigger('submission:created', submission);
    });

    addView.on('error', function(response) {
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
  };
});
