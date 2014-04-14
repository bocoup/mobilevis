const config = require('../../config/api');
const express = require('express');

var app = express();

if(config.debug) {
  app.use(express.errorHandler());
  app.use(function (req, res, next) {
    if (config.token) {
      req.token = config.token;
    }
    console.log(req.method, req.url, req.body);
    next();
  });
}

module.exports = app;
