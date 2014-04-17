module.exports = function (model) {
  return function (req, res, next) {
    req.Model = model;
    next();
  };
};
