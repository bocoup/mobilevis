/**
 * Sets the model in question on the request
 * @param  {Object} model
 */
module.exports = function (model) {
  return function (req, res, next) {
    req.Model = model;
    next();
  };
};
