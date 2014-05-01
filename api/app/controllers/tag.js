const BaseController = require('endpoints-controller');

module.exports = BaseController.extend({

  // ==== GET ====
  submissions: function(req, res, next) {
    var params = req.params;

    new req.Model({
      id : params.id,
    }).fetch({
      withRelated : ['submissions']
    }).then(function(tag) {
      res.data = tag;
      next();
    });
  }

});