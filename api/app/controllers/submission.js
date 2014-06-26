const BaseController = require('endpoints-controller');
var SubmissionImage = require('../models/image');
var path = require('path');

module.exports = BaseController.extend({

  // ==== GET ====
  /**
   * Gets all submissions
   * @param  {Request}   req
   * @param  {Response}   res
   * @param  {Function} next
   */
  getAll: function(req, res, next) {

    req.Model.collection().query(function(qb) {
      qb.orderBy('timestamp', 'desc');
    }).fetch({
      withRelated: ['tags', 'images']
    }).then(function(submissions) {
      res.data = { models : submissions.models };
      next();
    });
  },

  /**
   * Gets a specific submission.
   * Request Object must have:
   *   - params : { id : submission_id }
   * @param  {Request}   req
   * @param  {Response}   res
   * @param  {Function} next
   */
  getOne: function(req, res, next) {
    (new req.Model({ id : req.params.id })).fetch({
        withRelated : ['tags', 'images']
      }).then(function(submission) {
        if (submission) {
          res.data = submission;
        } else {
          res.code = 404;
          res.data = {
            errors : [
              { message : "Submission not found", status : "Not Found" }
            ]
          };
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

  // ==== POST ====


  /**
   * tag a submission with a new tag.
   * Request Object must have:
   *  - params : { id : submission_id }
   *  - body: { tag : tag_name }
   * @param  {Request}   req
   * @param  {Response}  res
   * @param  {Function} next
   */
  tag: function(req, res, next) {
    (new req.Model({ id : req.params.id }))
      .fetch().then(function(submission) {
        submission.tagAs(req.body.tag).then(function(submission) {
          res.data = submission;
          next();
        });
      });
  },

  feed: function(req, res, next) {
    req.Model.generateFeed(path.resolve("/vagrant/public/rss.xml")).then(function() {
      next();
    }, function(err) {
      console.log("feed making failed!", err);
      next();
    });
  },

  /**
   * Adds a new submission.
   * Request Object must have:
   *  - user: { username : twitter_handle }
   *  - body: {
   *    name : submission_name,
   *    creator: submission_creator,
   *    original_url: original_url_of_live_submission,
   *    description: description_of_submission,
   *    tags: array_of_tags,
   *    images: array_of_image_uuids
   *  }
   * @param {Request}   req
   * @param {Response}   res
   * @param {Function} next
   */
  add: function(req, res, next) {

    if (req.user.username) {
      // build submission
      req.Model.add({
        name : req.body.name,
        creator: req.body.creator,
        original_url: req.body.original_url,
        description: req.body.description,
        is_published: true,
        tags: req.body.tags.split(","),
        images: req.files.map(function(file) {
          return file.uuid;
        }),
        twitter_handle: req.user.username
      }).then(function(submission) {
        res.data = submission;
        next();
      }, function(err) {
        res.code = 400;
        console.log("err", err);
        res.data = err;
        next();
      });
    } else {
      res.code = 401;
      res.data = { message : "You must be logged in to add submissions" };
      next();
    }
  },

  /**
   * Updates a submission details.
   * Request Object must have:
   *  - user : {username : twitter_handle },
   *  - body : << See add >>
   * @param  {Request}   req
   * @param  {Response}   res
   * @param  {Function} next
   */
  update: function(req, res, next) {
    if (req.user.username) {

      // find submission we're editing
      req.Model.forge({ id : req.params.id }).fetch().then(function(submission) {

        if (typeof submission === "undefined" || submission === null) {
          res.code = 404;
          res.data = { message : "This submission doesn't exist!"};
          next();
        } else {

          if (submission.get('twitter_handle') === req.user.username || req.isAdmin) {
            req.Model.update(submission, {
              name : req.body.name,
              creator: req.body.creator,
              original_url: req.body.original_url,
              description: req.body.description,
              is_published: true,
              twitter_handle: req.user.username,
              tags: req.body.tags.split(","),
              previous_tags: req.body.previous_tags

            }).then(function(submission) {

              // update image as preview
              if (req.body.preview_image) {
                new SubmissionImage({ id : +req.body.preview_image}).fetch().then(function(image) {

                  if (typeof image === "undefined" || image === null) {
                    // we won't update an image, but that's ok.
                    next();
                  } else {

                    // update the image as the preview thumbnail
                    SubmissionImage.update(image, {
                      isPreview : true
                    }).then(function(image) {
                      res.data = submission;
                      next();
                    }, function(err) {
                      res.code = 400;
                      res.data = err;
                      next();
                    });
                  }
                });
              }

            }, function(err) {
              res.code = 400;
              res.data = err;
              next();
            });
          } else {
            res.code = 401;
            res.data = { message : "You can't edit this submission." };
            next();
          }
        }
      });
    }
  }
});