const config = require('./config/api');
const session = require('./config/session');

const express = require('express');
const routeBuilder = require('express-routebuilder');
const Inflector = require('inflection');

var P = require('./app/classes/passport');

const resources = [
  'submission',
  'tag'
];

var app = express();

app.use(express.logger());
app.use(express.cookieParser());
app.use(express.methodOverride());

// body parsing
app.use(express.json());
app.use(express.urlencoded());

// allow cross domain
app.use(require('./app/middlewares/cors'));

// route debugging
app.use(require('./app/middlewares/debug'));

// session secret key
app.use(express.session({ secret: session.secret }));

// add passport integration
var passport = P.init();
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(routeBuilder(express, require('./app/routes/passport')(passport)));

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
