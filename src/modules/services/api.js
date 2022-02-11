define(function(require) {
  var routes = {
    prefix: "/api/v1/"
  };

  // user specific routes
  routes.user = {
    profile : routes.prefix + "users/profile",
    submissions : function(username) {
      return routes.prefix + "users/submissions/" + username;
    }
  };

  // creator specific routes
  routes.creator = {
    submissions : function(creator) {
      return routes.prefix + "creators/submissions/" + creator;
    }
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

  // comment routes
  routes.comments = {
    submission: function(submissionId) {
      return routes.prefix + "submissions/" + submissionId + "/comments";
    }
  };

  // tag routes
  routes.tags = {
    show : routes.prefix + "tags/"
  };

  return routes;
});
