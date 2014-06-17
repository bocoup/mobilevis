var adminList = require('../../../config/admins');

/**
 * Checks to see if a user is an admin.
 * Required parameters on the request object:
 *   - user (with a 'username' property)
 * If true, sets req.isAdmin = true. Otherwise, req.isAdmin = false.
 * @param {Boolean} ShouldFail If true, then will fail request, otherwise will
 * only set the result on the request and pass it on.
 */
module.exports = function(shouldFail) {
  return function (req, res, next) {
    if (req.user) {
      if (req.user.username) {
        if (adminList.indexOf(req.user.username) > -1) {
          req.isAdmin = true;
        } else {
          req.isAdmin = false;
        }
      }
    } else {
      req.isAdmin = false;
    }

    if (shouldFail) {
      if (req.isAdmin) {
        next();
      } else {
        res.code = 401;
        res.data = {
          errors: [
            { message : "Only admins an do this.", status: "Unauthorized" }
          ]
        };
        res.send(res.data, res.code);
      }
    } else {
      next();
    }
  };
};

