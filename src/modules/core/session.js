define(function(require){

  var $ = require("jquery");
  var API = require("modules/services/api");
  var Backbone = require("backbone");

  var user = null;

  return {
    getProfile: function() {
      var def = $.Deferred();
      if (user !== null) {
        def.resolve(user);
      } else {
        $.getJSON(API.user.profile).then(function(data) {
          if (typeof data.user !== "undefined") {
            user = new Backbone.Model(data.user || {});
          }
          def.resolve(user);
        }).fail(function(err) {
          def.reject(user, err);
        });
      }

      return def;
    },

    getUser: function() {
      return user;
    },

    isLoggedIn: function() {
      return user === null ||
        Object.keys(user).length === 0;
    }
  };
});
