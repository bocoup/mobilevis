const BaseController = require('endpoints-controller');

var SubmissionModel = require('../models/submission');

module.exports = BaseController.extend({

  // ==== GET ====
  /**
   * Gets all submissions by a certain creator.
   * Request Object must have:
   *  - params : { creator : creator_name }
   * @param  {Request}   req
   * @param  {Response}   res
   * @param  {Function} next
   */
  submissions: function(req, res, next) {
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
