const BaseController = require('endpoints-controller');

module.exports = BaseController.extend({

  // ==== GET ====
  /**
   * Gets all submissions tagged as something.
   * Request Object requires:
   *   - params : { id : tag_id }
   * @param  {Request}   req
   * @param  {Response}   res
   * @param  {Function} next
   */
  submissions: function(req, res, next) {
    var params = req.params;

    new req.Model({
      id : params.id,
    }).fetch().then(function(tag) {
      tag.load(['submissions', 'submissions.tags', 'submissions.images']).then(function(full_tag) {
        res.data = tag;
        next();
      });
    });
  }

});
