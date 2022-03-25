define(function(require) {
  var routes = {
    prefix: "/data/"
  };

  // user specific routes
  routes.user = {
    profile : routes.prefix + "users/profile",
    submissions : function(username) {
      return routes.prefix + "users/submissions/" + username + '.json';
    }
  };

  // creator specific routes
  routes.creator = {
    submissions : function(creator) {
      return routes.prefix + "creators/submissions/" + creator + '.json';
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
    all: routes.prefix + "submissions.json",
    show: routes.prefix + "submissions/"
  };

  // comment routes
  routes.comments = {
    submission: function(submissionId) {
      return routes.prefix + "submissions/" + submissionId + "/comments.json";
    }
  };

  // tag routes
  routes.tags = {
    show : routes.prefix + "tags/"
  };

  return routes;
});
