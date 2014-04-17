const Model = require('../models/submission');
const Controller = require('../controllers/submission');
const BaseRouter = require('../base/router');

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
    }
  }
});