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
      "/" : [
        Controller.getAll,
        Controller.serialize
      ],
      "/:id" : [
        Controller.getOne,
        Controller.serialize
      ],
      "/:id/comments" : [
        CommentsController.getAll,
        CommentsController.serialize
      ],
    },

    post: {

      // tag submission
      "/:id/tag" : [
        Controller.tag,
        Controller.serialize
      ],

      "/:id/comments" : [
        CommentsController.add,
        CommentsController.serialize
      ],

      // add new submission
      "/" : [
        StreamToS3,
        Controller.add,
        Controller.serialize
      ]
    },

    delete: {
      '/:id': [
        exports.isAdmin(true), // actual fail if not admin
        Controller.findById,
        RemoveFromS3,
        Controller.destroyCascade,
        Controller.serialize
      ]
    }
  }
});