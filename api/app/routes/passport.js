module.exports = function(passport) {

  return {
    get : {

      /**
      * GET /auth/twitter
      *   Use passport.authenticate() as route middleware to authenticate the
      *   request.  The first step in Twitter authentication will involve redirecting
      *   the user to twitter.com.  After authorization, the Twitter will redirect
      *   the user back to this application at /auth/twitter/callback
      */
      '/auth/twitter' : [
          passport.authenticate('twitter',
          {
            successRedirect: '/',
            failureRedirect: '/login'
          })
      ],

      /**
      * GET /auth/twitter/callback
      *   Use passport.authenticate() as route middleware to authenticate the
      *   request.  If authentication fails, the user will be redirected back to the
      *   login page.  Otherwise, the primary route function function will be called,
      *   which, in this example, will redirect the user to the home page.
      */
      '/auth/twitter/callback' : [

        passport.authenticate('twitter', {
          failureRedirect: '/login'
        }),

        function(req, res, next) {
          res.redirect('/');
       }
      ],

      /**
      * GET /logout
      * Logs out current user.
      */
      '/logout' : [
        function(req, res, next) {
          req.logout();
          res.redirect('/');
        }
      ]
    }
  };
};
