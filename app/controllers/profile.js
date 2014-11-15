var user = require('../user.js');
var debug = require('debug')('profile')

module.exports = function () {

  this.on('submit', function (event) {
    var user = this.get('user')
    $.ajax({
      url: '/api/users/' + user.id,
      data: user,
      type: 'PUT',
      success: function (data, status) {
        window.ractive.set('message', data.message);
      }
    });

    event.original.preventDefault();
  });
}
