var user = require('../models/user.js');
var debug = require('debug')('profile')

module.exports = function () {
  var ractive = this

  ractive.on('submit', function (event) {
    user.update(ractive.get('user'), function (err) {
      var message = {
        'type': 'success',
        'text': 'Profile updated successfully!'
      }

      if (err) {
        message = {
          'type': 'error',
          'text': 'We could not update your profile!'
        }
      }
      window.ractive.set('message', message)
    })
    event.original.preventDefault();
  });
}
