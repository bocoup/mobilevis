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
    var params = req.params;
    req.Model.byId(params.id).then(function(submission) {
      console.log(submission);
      req.output = submission;
      next();
    });
  }

  // ==== POST ====
});