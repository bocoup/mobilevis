const BaseController = require('endpoints-controller');

module.exports = BaseController.extend({

  // ==== GET ====
  getAll: function(req, res, next) {
    req.Model.collection().fetch({
        withRelated : ['tags', 'images']
      }).then(function(submissions) {
      req.output = submissions.models;
      next();
    });
  },

  getOne: function(req, res, next) {
    (new req.Model({ id : req.params.id })).fetch({
        withRelated : ['tags', 'images']
      }).then(function(submission) {
        req.output = submission;
        next();
      });
  },

  comments: function(req, res, next) {
    var params = req.params;
    new req.Model({ id : params.id }).fetch({
      withRelated : ['comments']
    }).then(function(submission) {
      req.output = submission.relations.comments.models;
      next();
    });
  },

  // ==== POST ====

  // tag a submission with a new tag
  tag: function(req, res, next) {
    (new req.Model({ id : req.params.id }))
      .fetch().then(function(submission) {
        submission.tagAs(req.body.tag).then(function(submission) {
          req.output = submission;
          next();
        });
      });
  }
});