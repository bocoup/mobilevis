define(function(require) {

  'use strict';

  // Libs.
  var $ = require('jquery');
  var Backbone = require('backbone');

  // This is for dev only and gets skipped during the final build.
  // require('livereload');

  // Need the Router before we call history.start
  require('src/modules/core/router');

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start({
    pushState: true,
    root: "/"
  });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a[href^='#']:not([data-bypass])", function(evt) {
    // Prevent the default event (including page refresh).
    evt.preventDefault();

    // `Backbone.history.navigate` is sufficient for all Routers and will
    // trigger the correct events. The Router's internal `navigate` method
    // calls this anyways. The fragment is sliced from the root.
    var href = $(this).attr("href");
    Backbone.history.navigate(href, true);
  });

});
