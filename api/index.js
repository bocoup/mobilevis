const config = require('./config/api');
const session = require('./config/session');

const express = require('express');
const routeBuilder = require('express-routebuilder');
const Inflector = require('inflection');

var P = require('./app/classes/passport');

var app = express();
var passport = P.init();

app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.methodOverride());

  // session secret key
  app.use(express.session({ secret: session.secret }));

  // body parsing
  app.use(express.json());
  app.use(express.urlencoded());

  // allow cross domain
  app.use(require('./app/middlewares/cors'));

  // route debugging
  app.use(require('./app/middlewares/debug'));

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  // router
  app.use(app.router);
});

// ====== Routes ======

// == Non resource routes:
app.use(routeBuilder(express, require('./app/routes/passport')(passport)));

// == Resource routes:
const resources = [
  'submission',
  'tag',
  'user'
];

if(!process.env.testing) {
  resources.forEach(function (resource) {
    var routes = require('./app/routes/'+resource);
    var namespace = config.prefix+'/'+Inflector.pluralize(resource);
    var subapp = routeBuilder(express, routes);

    console.log(namespace);
    subapp.locals = app.locals;
    app.use(namespace, subapp);
  });
}

module.exports = app;
