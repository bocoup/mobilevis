// Assign the model we care about for a given route.
module.exports = function (model) {
  return function (req, res, next) {
    req.Model = model;
    next();
  };
};
