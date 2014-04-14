module.exports = function(req, res, next) {
  if (req.account) {
    next();
  } else {
    res.send(403);
  }
};
