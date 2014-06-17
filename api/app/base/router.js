exports.assignModel = require('./router/assign_model');
exports.isAdmin = require('./router/is_admin');

/**
 * Base router object. Routers are created per model and this
 * serves as the base templates for some of the REST routes we
 * will likely encounter.
 *
 * @param  {[Object]} opts Routes to set
 * @return {Object}
 */
exports.extend = function (opts) {
  if (!opts.model) {
    throw new Error('You must provide a model.');
  }
  if (!opts.controller) {
    throw new Error('You must provide a controller.');
  }
  var model = opts.model;
  var controller = opts.controller;
  var routes = opts.routes;
  var result = {};
  var baseRouter = {

    all: {

      /*
        All routes start off by getting their model assigned to their
        req.Model, so that we can more easily make those requests.
       */
      '*': [
        exports.assignModel(model)
      ]
    },

    get: {

      /*
        Default get model finds many instances of the model based on the params
        and then serializes it to json.
       */
      '/': [
        controller.findMany,
        controller.serialize
      ],

      /*
        Finding a model by an id, then serilizing it to json.
       */
      '/:id': [
        controller.findById,
        controller.serialize
      ],
    },
    post: {

      /*
        Posting a new model and then serializing it to json. Each model
        takes care of its own security (some models can be posted by anyone
        whereas others need to be verified, for example.)
       */
      '/': [
        controller.create,
        controller.serialize
      ],
    },
    put: {

      /*
        Updates happen to models that exist, so first they are found, then passed
        to the update routine, then serialized to json.
       */
      '/:id': [
        controller.findById,
        controller.update,
        controller.serialize
      ]
    },
    delete: {

      /*
        Deleting is only allowed by admins by default. The model must exist, then
        all its dependencies are removed and it is serialized to json.
       */
      '/:id': [
        exports.isAdmin(true), // actual fail if not admin
        controller.findById,
        controller.destroyCascade,
        controller.serialize
      ]
    }
  };

  if (!routes) {

    // by default the router initializes with the routes above
    result = baseRouter;

  } else {
    // if routes were provided, merge routes manually

    // for each verb (get/put/post/delete etc.)
    Object.keys(baseRouter).forEach(function (verb) {

      var baseVerb = baseRouter[verb];

      // if new routes don't exist, use the default.
      if(!routes[verb]) {
        routes[verb] = baseVerb;

      // otherwise:
      } else {
        // completely remove verbs which are nulled
        if (routes[verb] === null) {
          delete routes[verb];
        } else {
          // combine them
          Object.keys(baseVerb).forEach(function (endpoint) {
            if(!routes[verb][endpoint]) {
              routes[verb][endpoint] = baseVerb[endpoint];
            }
          });
        }
      }
    });
    // awful hack to ensure that the insertion order of the
    // merged object has the 'all' verb first to ensure things
    // work properly for express.
    var verbs = Object.keys(routes);
    verbs.splice(0, 0, verbs.splice(verbs.indexOf('all'),1)[0]);
    verbs.forEach(function (verb) {
      result[verb] = routes[verb];
    });
  }
  return result;
};
