const Model = require('../models/tag');
const Controller = require('../controllers/tag');
const BaseRouter = require('../base/router');

module.exports = BaseRouter.extend({
  model: Model,
  controller: Controller,
  routes: {
    get : {

      /*
        Gets all submissions tagged as this tag id.
       */
      "/:id" : [
        Controller.submissions,
        Controller.serialize
      ]
    }
  }
});

// also available:
// GET "/" - lists all tags, without submissions
