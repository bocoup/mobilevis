require.config({

  // Make all requires relative to /.
  baseUrl: '../',

  deps: ['src/main'],

  // Map components to nice paths.
  paths: {
    'backbone': 'bower_components/backbone/backbone',
    'jquery': 'bower_components/jquery/jquery',
    'lodash': 'bower_components/lodash/dist/lodash.underscore',
    'tmpl': 'bower_components/lodash-template-loader/loader',
    'underscore': 'bower_components/underscore/underscore',
    'moment' : 'bower_components/momentjs/moment',
    'masonry' : 'bower_components/masonry/dist/masonry.pkgd',
    'dropzone': 'bower_components/dropzone/downloads/dropzone-amd-module',
    'swiper': 'bower_components/swiper/dist/idangerous.swiper',
    'imagesloaded': 'bower_components/imagesloaded/imagesloaded.pkgd',

    // Commonly-used application subdirectories
    'core': 'src/modules/core',
    'components': 'src/modules/components',
    'layouts': 'src/modules/layouts',
    'services': 'src/modules/services',

    // This must work in the browser AND not explode in the r.js build step.
    'livereload': 'http://' + (typeof location !== 'undefined' ?
      location.hostname : 'localhost') + ':35729/livereload.js?snipver=1'
  },

  // Load non-AMD dependencies.
  shim: {
    'backbone': {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },

    'masonry' : {
      deps: ['jquery'],
      exports: 'Masonry'
    }
  }

});
