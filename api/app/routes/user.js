module.exports = {
  get : {
    "/profile" : [
      function(req, res) {
        res.json(200, { user: req.user });
      }
    ]
  }
};