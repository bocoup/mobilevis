const Controller = require('../controllers/creator');

module.exports = {
  get : {
    "/submissions/:creator" : [
      Controller.submissions,
      Controller.serialize
    ]
  }
};