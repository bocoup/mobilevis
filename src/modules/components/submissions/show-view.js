define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/submissions/show-view');
  var $ = require('jquery');
  var Swiper = require('swiper');
  var imagesLoaded = require('imagesloaded');

  var swiperInstance;
  return BaseView.extend({
    template: template,

    events: {
      'click .image-control' : 'adjustSlideshow',
      'click .tag' : 'showTagSubmissions',
      'click a#delete' : 'deleteSubmission',
      "click .creator a" : "showCreatorSubmissions",
      "click .submitted_by a" : "showUserSubmissions"
    },

    initialize: function(options) {
      this.user = options.user;
    },

    postPlace: function() {
      var imagesContainer = $('.image');
      imagesLoaded(imagesContainer, function(instance) {
        var images = imagesContainer.find('img');

        if (images.size() > 1) {
          var maxHeight = 0;

          images.each(function(idx, img) {
            var imageHeight = $(img).height();
            if (imageHeight > maxHeight) {
              maxHeight = imageHeight;
            }
          });

          imagesContainer.height(maxHeight + 80); // for padding top/bottom

          // sort out width of container. be explicit, for swiper.
          imagesContainer.css({
            width: imagesContainer.width()
          });

          // TODO find tallest
          swiperInstance = new Swiper('.image', {
            mode: 'horizontal'
          });
        }

      });

      return this;
    },

    adjustSlideshow : function(ev) {

      if (swiperInstance) {
        var control = $(ev.target);
        if (control.hasClass('image-before')) {
          swiperInstance.swipePrev();
        }
        if (control.hasClass('image-after')) {
          swiperInstance.swipeNext();
        }
      }
    },

    showTagSubmissions: function(ev) {
      ev.stopPropagation();
      var tag = $(ev.target).data('tag-id');
      this.trigger('tag:show', tag);
      return false;
    },
    showCreatorSubmissions: function(ev) {
      ev.stopPropagation();
      var creator = $(ev.target).data('creator');
      this.trigger('creator:show', creator);
      return false;
    },
    showUserSubmissions: function(ev) {
      ev.stopPropagation();
      var user = $(ev.target).data('user');
      this.trigger('user:show', user);
      return false;
    },
    deleteSubmission: function(ev) {
      ev.stopPropagation();
      var self = this;
      this.model.destroy({
        wait: true,
        success: function(model) {
          self.trigger('submission:delete', model);
        },
        error: function(err) {
          self.trigger('error', err);
        }
      });
      return false;
    },

    serialize: function() {

      console.log(this.user);
      return {
        submission: this.model.toJSON(),
        user: this.user ? this.user.toJSON() : {}
      };
    }

  });
});