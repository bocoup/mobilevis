module.exports = {

  init: function() {
    var passport = require('passport'),
        TwitterStrategy = require('passport-twitter').Strategy,
        Auth = require('../../config/twitter');

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Twitter profile is serialized
    //   and deserialized.
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    // Use the TwitterStrategy within Passport.
    //   Strategies in passport require a `verify` function, which accept
    //   credentials (in this case, a token, tokenSecret, and Twitter profile), and
    //   invoke a callback with a user object.
    passport.use(new TwitterStrategy({
        consumerKey: Auth.CONSUMER_KEY,
        consumerSecret: Auth.CONSUMER_SECRET,
        callbackURL: Auth.redirect_host + "/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

          // To keep the example simple, the user's Twitter profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Twitter account with a user record in your database,
          // and return that user instead.
          return done(null, profile);
        });
      }
    ));


    return passport;
  },

  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }
};