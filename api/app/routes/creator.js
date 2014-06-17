const Controller = require('../controllers/creator');

module.exports = {

  get : {

    /*
      Gets all submissions for a creator, then serialize them.
     */
    "/submissions/:creator" : [
      Controller.submissions,
      Controller.serialize
    ]
  }
};