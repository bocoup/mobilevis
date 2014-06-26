const Model = require('../models/submission');
const Controller = require('../controllers/submission');
const BaseRouter = require('../base/router');
const StreamToS3 = require('../middlewares/stream_to_s3');
const RemoveFromS3 = require('../middlewares/remove_from_s3');
const CommentsController = require('../controllers/comment');
exports.isAdmin = require('../base/router/is_admin');

module.exports = BaseRouter.extend({
  model: Model,
  controller: Controller,
  routes: {
    get : {

      /*
        Gets all submissions
       */
      "/" : [
        Controller.getAll,
        Controller.serialize
      ],

      /*
        Gets a specific submission by id
       */
      "/:id" : [
        Controller.getOne,
        Controller.serialize
      ],

      /*
        Gets comments for a submission
       */
      "/:id/comments" : [
        CommentsController.getAll,
        CommentsController.serialize
      ],
    },

    post: {

      /*
        Posts a new tag for a submission
       */
      "/:id/tag" : [
        Controller.tag,
        Controller.serialize
      ],

      /*
        Posts a comment to a submission
       */
      "/:id/comments" : [
        CommentsController.add,
        CommentsController.serialize
      ],

      /*
        Adds a new submission by first uploading images, then adding the
        submission.
       */
      "/" : [
        StreamToS3,
        Controller.add,
        Controller.feed,
        Controller.serialize
      ]
    },

    put: {

      /*
        Updates a submission
       */
      "/:id" : [
        exports.isAdmin(false), // don't fail if not admin, just set flag.
        StreamToS3,
        Controller.update,
        Controller.feed,
        Controller.serialize
      ]
    },

    delete: {

      /*
        Deletes a submission. Only allowed for admins
       */
      '/:id': [
        exports.isAdmin(true), // actual fail if not admin
        Controller.findById,
        RemoveFromS3,
        Controller.destroyCascade,
        Controller.feed,
        Controller.serialize
      ]
    }
  }
});