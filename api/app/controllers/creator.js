const BaseController = require('endpoints-controller');

var SubmissionModel = require('../models/submission');

module.exports = BaseController.extend({

  // ==== GET ====
  submissions: function(req, res, next) {
    var params = req.params;

    SubmissionModel.collection().query(function(qb) {
      qb.where('creator', '=', req.params.creator);
    }).fetch({ withRelated: ['tags','images'] }).then(function(submissions) {
      res.data = {
        creator: req.params.creator,
        submissions: submissions.models
      };
      next();
    });
  }

});