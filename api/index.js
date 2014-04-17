const config = require('./config/api');
const express = require('express');
const routeBuilder = require('express-routebuilder');
const Inflector = require('inflection');

const resources = [
  'submission'
];

var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(require('./app/middlewares/cors'));
app.use(require('./app/middlewares/debug'));

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
