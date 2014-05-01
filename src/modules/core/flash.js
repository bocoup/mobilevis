define(function(require) {
  var $ = require('jquery');

  return {
    display: function(message) {
      $('#flash').html(message).show()
        .delay(message.length * 500)
        .fadeOut();
    },
    clear: function() {
      $('#flash').empty().hide();
    }
  };
});