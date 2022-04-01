define(function(require) {

  var API = require('modules/services/api');
  var $ = require('jquery');
  require('jquery-select');

  var BaseView = require('modules/core/base-view');
  var template = require('tmpl!modules/components/submissions/add-view');
  var imagePreviewTemplate = require('tmpl!modules/components/submissions/add-image-preview');

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
          clickable: '.fileinput-button',
          acceptedFiles: 'image/gif,image/jpeg,image/pjpeg,image/png'
        });

        myDropzone.on('error', function() {
          console.error(arguments);
        });
      },1000);

      $.ajax({
        url : API.tags.show,
        method: 'GET'
      }).then(function(tags) {

        // add select with all available tags
        self.$el.find('#tags').select2({
          multiple: true,
          width: "300px",
          data: tags.map(function(tag) {
            return {
              id: tag.tag,
              text: tag.tag
            };
          }),
          createSearchChoice:function(term, data) {
            if ( $(data).filter( function() {
             return this.text.localeCompare(term)===0;
            }).length===0) {
             return {id:term, text:term};
            }
          }
        });

      });

    },

    submit: function(e) {
      var self = this;
      e.preventDefault();

      var form = $(e.target);
      var data = new FormData();

      // hide button
      form.find('#submit').hide();
      form.find("#loader-gif").show();

      data.append('name', form.find('#name').val());
      data.append('creator', form.find('#creator').val());
      data.append('original_url', form.find('#original_url').val());
      data.append('description', form.find('#description').val());

      // process tags
      var tags;

      try {
         tags = form.find('#tags')
          .val()
          .split(",")
          .map(function(t) {
            return t.trim();
          }).filter(function(t) {
            return t.length > 0;
          })
          .join(",");
      } catch(exp) {
        tags = form.find('#tags');
      }

      data.append('tags', tags);

      // attach images to the data
      // var files = form.find('#image-mobile')[0].files;
      var files = myDropzone.getFilesWithStatus(Dropzone.ADDED);
      for(var i = 0; i < files.length; i++) {
        var file = files[i];
        data.append('image-mobile['+i+']', file);
      }

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

          // show button so people can resubmit
          form.find('#submit').show();
          form.find("#loader-gif").hide();

          if (jqXhr.status === 413) {
            self.trigger('error', "One of your files is too large!");
          } else {
            try {
              self.trigger('error', JSON.parse(jqXhr.responseText));
            } catch (e) {
              self.trigger('error', jqXhr.responseText);
            }
          }

        }
      });

      return false;
    }
  });
});
