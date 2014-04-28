const Model = require('../models/submission');
const Controller = require('../controllers/submission');
const BaseRouter = require('../base/router');
const StreamToS3 = require('../middlewares/stream_to_s3');

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
        Controller.comments,
        Controller.serialize
      ],
    },

    post: {

      // tag submission
      "/:id/tag" : [
        Controller.tag,
        Controller.serialize
      ],

      // add new submission
      "/" : [
        StreamToS3,
        Controller.add,
        Controller.serialize
      ]
    }
  }
});