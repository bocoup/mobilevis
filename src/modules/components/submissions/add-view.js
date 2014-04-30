define(function(require) {

  var BaseView = require('src/modules/core/base-view');
  var template = require('tmpl!src/modules/components/submissions/add-view');

  return BaseView.extend({
    template: template,

    events: {
      // "submit form" : "submit"
    },

    serialize: function() {
      return {
        submission: this.model.toJSON()
      };
    },

    // submit: function(e) {
    //   e.preventDefault();

    //   // serialize fields (all but files)
    //   var map = {};
    //   var fields = $(e.target).serializeArray().map(function(pair) {
    //     map[pair.key] = pair.value;
    //   });

    //   // handle file

    //   // TODO do form submission here
    //   // name: this.$('input[name=name]').val(),
    //   // key: this.$('input[name=key]').val()

    //   return false;
    // }
  });
});