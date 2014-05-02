const BaseController = require('endpoints-controller');

module.exports = BaseController.extend({

  // ==== GET ====
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