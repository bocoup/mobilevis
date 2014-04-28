define(function(require) {
  var routes = {
    prefix: "/api/v1/"
  };

  // user specific routes
  routes.user = {
    profile : routes.prefix + "users/profile"
  };

  routes.images = {
    add: routes.prefix + "add/image"
  };

  routes.auth = {
    twitter_login: "auth/twitter",
    twitter_logout: routes.prefix + "logout",
  };

  return routes;
});