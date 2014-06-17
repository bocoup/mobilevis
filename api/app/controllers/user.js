const BaseController = require('endpoints-controller');

var SubmissionModel = require('../models/submission');

module.exports = BaseController.extend({

  // ==== GET ====
  /**
   * Returns all submissions by a specific user
   * Request Object requires:
   *   - params : { twitter_handle : submitters_twitter_handle }
   * @param  {Request}   req
   * @param  {Response}   res
   * @param  {Function} next
   */
  submissions: function(req, res, next) {

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