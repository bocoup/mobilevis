define(function(require) {
  var routes = {
    prefix: "/api/v1/"
  };

  // user specific routes
  routes.user = {
    profile : routes.prefix + "users/profile"
  };

  // image routes
  routes.images = {
    add: routes.prefix + "add/image"
  };

  // auth routes
  routes.auth = {
    twitter_login: "/auth/twitter",
    twitter_logout: "/logout",
  };

  // submission routes
  routes.submissions = {
    all: routes.prefix + "submissions/",
    show: routes.prefix + "submissions/"
  };

  // tag routes
  routes.tags = {
    show : routes.prefix + "tags/"
  };

  return routes;
});