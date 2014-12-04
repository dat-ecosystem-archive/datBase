var users = require('../models/users.js');
var debug = require('debug')('settings')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/pages/settings.html'),
    onrender: function () {
      var ractive = this

      ractive.on('submit', function (event) {
        users.update(ractive.get('user'), function (err) {
          if (!err) {
            window.ractive.set('message', {
              'type': 'success',
              'text': 'Profile updated successfully!'
            })
          }
        })
        event.original.preventDefault();
      });
    }
  }
}