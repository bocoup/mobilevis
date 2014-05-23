define(function(require) {

  var $ = require('jquery');
  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/submissions/add-view');
  var imagePreviewTemplate = require('tmpl!src/modules/components/submissions/add-image-preview');

  var Dropzone = require('dropzone');
  var myDropzone;

  return BaseView.extend({
    template: template,

    events: {
      "submit form" : "submit"
    },

    serialize: function() {
      return {
        submission: this.model.toJSON()
      };
    },

    postPlace: function() {
      var self = this;
      setTimeout(function() {
        myDropzone = new Dropzone(self.el, {
          thumbnailWidth: 80,
          thumbnailHeight: 80,
          parallelUploads: 20,
          url: 'bla',
          previewTemplate: imagePreviewTemplate(),
          autoQueue: false,
          previewsContainer: "#image-previews",
          clickable: '.fileinput-button'
        });
    },1000);

    },

    submit: function(e) {
      var self = this;
      e.preventDefault();

      var form = $(e.target);
      var data = new FormData();

      data.append('name', form.find('#name').val());
      data.append('creator', form.find('#creator').val());
      data.append('original_url', form.find('#original_url').val());
      data.append('tags', form.find('#tags').val());

      // attach images to the data
      // var files = form.find('#image-mobile')[0].files;
      var files = myDropzone.getFilesWithStatus(Dropzone.ADDED);
      for(var i = 0; i < files.length; i++) {
        var file = files[i];
        data.append('image-mobile['+i+']', file);
      }


      console.log(data);

      $.ajax({
        url: '/api/v1/submissions/',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(submission){
          // REDIRECT TO SUBMISSION PAGE
          self.trigger('created', submission);
        },
        error: function(jqXhr) {
          self.trigger('error', JSON.parse(jqXhr.responseText));
        }
      });

      return false;
    }
  });
});