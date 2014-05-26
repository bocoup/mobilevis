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
      'click .image-control' : 'adjustSlideshow'
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

    serialize: function() {
      return {
        submission: this.model.toJSON()
      };
    }

  });
});