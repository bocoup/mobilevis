const BaseController = require('endpoints-controller');

var SubmissionModel = require('../models/submission');

module.exports = BaseController.extend({

  // ==== GET ====
  submissions: function(req, res, next) {
    var params = req.params;

    SubmissionModel.collection().query(function(qb) {
      qb.where('twitter_handle', '=', req.params.twitter_handle);
    }).fetch({ withRelated: ['tags','images'] }).then(function(submissions) {
      res.data = {
        user: req.params.twitter_handle,
        submissions: submissions.models
      };
      next();
    });
  }

});