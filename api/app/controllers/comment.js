const BaseController = require('endpoints-controller');

var Model = require('../models/comment');

module.exports = BaseController.extend({

  // get all comments for as submission
  getAll: function(req, res, next) {
    var params = req.params;
    Model.findBySubmissionId({ submission_id : params.id })
      .then(function(comments) {
        if (comments === null) {
          res.code = 404;
          res.data = {
            errors : [
              { message : "Submission not found", status : "Not Found" }
            ]
          };
        } else {
          console.log(comments);
          res.data = comments.models;
        }
        next();
      }, function(err) {
        res.code = 400;
        res.data = {
          errors : [
            { message : err, status : "Bad Request" }
          ]
        };
      });
  },

  // ===== post =====
  add: function(req, res, next) {

    if (req.user.username) {

      // make sure we have a submission id
      if (!req.params.id) {
        // missing submission id
        res.code = 400;
        res.data = [
          { message : "Submission id required.", status: "Bad Request" }
        ];
        next();
      } else {

        // try to find comments for submission
        Model.add({
          submission_id : req.params.id,
          comment : req.body.comment,
          twitter_handle: req.user.username
        }).then(function(comment) {
            res.data = comment;
            next();
          }, function(err) {
            res.code = 404;
            res.data = {
              errors : [
                { message : "Submission not found", status : "Not Found" }
              ]
            };
            next();
          });
      }

    } else {

      // not logged in, unauthorized.
      res.code = 401;
      res.data = [
        { message : "You must be logged in to comment.", status: "Unauthorized" }
      ];
      next();
    }
  },
});