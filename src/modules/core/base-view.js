define(function(require) {

  'use strict';

  var Backbone = require('backbone');
  var $ = require('jquery');

  // BaseView's prototype is Backbone.View
  var BaseView = Backbone.View.extend({

    constructor: function() {

      // Create a per instance subViews property.
      // It is a map of unique child ids to child views.
      // The child id can be a number or string, e.g. the id of the associated model
      this.subViews = {};

      // Call super to invoke the default constructor functionality
      Backbone.View.apply( this, arguments );

    },

    addSubView: function( subViewSpec ) {

      // If we didn't pass an options object, create one.
      subViewSpec.options = subViewSpec.options || {};

      // Add the `el` property to our options for creating a View instance
      subViewSpec.options.el = this.$template.find(subViewSpec.container).get(0);

      // Create our subView instance, render, and place it in the document
      var subView = new subViewSpec.viewType( subViewSpec.options )
        .render()
        .place();

      // Add it to the subViews map
      this.subViews[ subViewSpec.name ] = subView;

      return subView;

    },

    destroy: function() {
      // Call destroy on all of the subViews we may have added
      this.destroySubViews();

      // Release event listeners
      this.stopListening();

      // Empty our element - do not remove it, because we will use it again
      this.$el.empty();

      return this;
    },

    destroySubViews: function() {

      // Cache local to this function
      var subViews = this.subViews;

      for ( var id in subViews ) {

        // Only delete own properties
        if ( subViews.hasOwnProperty(id) ) {
          subViews[ id ].destroy();

          // Destroy removes the events and DOM element
          // Call delete to remove the object from memory
          delete subViews[ id ];
        }
      }

      return this;
    },

    place: function() {

      // We're only putting views on existing elements, so set that element's
      // content to be our rendered template
      this.$el.html(this.$template);

      this.postPlace();

      return this;

    },

    // Our postPlace lifecycle method for anything we want to do after our view
    // is in the DOM
    // This is a good place to invoke libraries that expect elements on the page
    // (UI libs, Canvas/SVG libs, etc.)
    postPlace: function() {},

    // Our postRender lifecycle method for anything we want to do after we have
    // rendered this view, but before we place it in the DOM
    // This is a good place to add subViews
    postRender: function() {},

    render: function() {

      // Set a reference to our fully-rendered template (so we can place
      // it later)
      this.$template = $(this.template(this.serialize()));

      // Call our postRender lifecycle method for anything we want to do after
      // we have rendered this view, but before we place it in the DOM
      this.postRender();
      return this;
    },

    // We call serialize before passing our model or collection into a template
    // This is good for wrapping our model/collection in another object for easy
    // reference
    serialize: function(){}

  });

  return BaseView;

});