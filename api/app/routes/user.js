var AdminsList = require("../../config/admins");
const Controller = require('../controllers/user');

module.exports = {
  get : {

    /*
      Gets user profile. Called everytime to verify authentication.
     */
    "/profile" : [
      function(req, res) {
        if (req.user) {
          if (AdminsList.indexOf(req.user.username) > -1) {
            req.user.isAdmin = true;
          } else {
            req.user.isAdmin = false;
          }
        }
        res.json(200, { user: req.user });
      }
    ],

    /*
      Gets all submissions by a single user
     */
    "/submissions/:twitter_handle" : [
      Controller.submissions,
      Controller.serialize
    ]
  }
};