var Ractive = require('ractive');
var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');

var users = require('../models/users.js');

module.exports = function(ctx, next) {
  users.currentUser(function (err, user) {
    if (err) ctx.state.user = null
    ctx.state.user = user
    render(user)
    next()
  })
}

function render(user) {
  window.ractive = new Ractive({
    el: '#main',
    template: require('../templates/main.html'),
    data: {
      user: user
    },
    onrender: function () {
      if (user) {
        var peeps = $('.content-card-small-avatar')
        for (var i = 0; i < peeps.length; i++) {
          var peep = peeps[i]
          var username = peep.getAttribute('data-user')
          if (!username) continue
          peep.setAttribute('style', "background-image: url('https://github.com/" + username + ".png')")
        }
      }

      $('[data-toggle="tooltip"]').tooltip()
    }
  })

}
