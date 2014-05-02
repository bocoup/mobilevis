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
    twitter_login: "auth/twitter",
    twitter_logout: routes.prefix + "logout",
  };

  // submission routes
  routes.submissions = {
    all: routes.prefix + "submissions/",
    show: routes.prefix + "submissions/"
  };

  return routes;
});