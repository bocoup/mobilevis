const s3 = require('../classes/s3');

module.exports = function (req, res, next) {

  req.model.images().fetch().then(function(images) {
    var paths = images.models.map(function(image) {
      return "images/" + image.attributes.url;
    });

    s3.destroy(paths).then(function(paths) {
      console.log("Paths removed from s3", paths);
      next(); // destroyed, pass on to removing the actual model.
    }, function(err) {
      console.log("Can't remove paths", err);
      res.code = 400;
      res.data = {
        errors : [
          { message : err }
        ]
      };
      res.send(res.code, res.data); // bail now, before we delete anything else!
    });
  });
};
