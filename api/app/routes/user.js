var AdminsList = require("../../config/admins");

module.exports = {
  get : {
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
    ]
  }
};