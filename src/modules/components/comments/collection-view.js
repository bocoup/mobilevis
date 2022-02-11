define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/comments/collection-view');
  var $ = require('jquery');

  return BaseView.extend({
    template: template,

    events: {
      "submit form" : "submit"
    },

    initialize: function(options) {
      this.listenTo(this.collection, "add remove update reset", this.render);
      this.user = options.user;
      this.loggedIn = options.loggedIn;
      this.submission_id = options.submission_id;
    },

    serialize: function() {
      return {
        comments: this.collection.sort().toJSON(), // sort in reverse
        loggedIn: this.loggedIn,
        user: this.user
      };
    },

    postRender: function() {
      this.$el.html(this.$template);
      return this;
    },

    submit: function(e) {
      var self = this;
      e.preventDefault();

      var form = $(e.target);
      var data = new FormData();

      data.append('comment', form.find('#comment').val());

      $.ajax({
        url: '/api/v1/submissions/' +
          self.submission_id + '/comments',
        data: {
          comment : form.find('#comment').val()
        },
        type: 'POST',
        success: function(comment) {
          self.collection.add(comment);
          self.trigger('created', comment);
        },
        error: function(jqXhr) {
          console.log('error', JSON.parse(jqXhr.responseText));
          self.trigger('error', JSON.parse(jqXhr.responseText));
        }
      });

      return false;
    }
  });
});
