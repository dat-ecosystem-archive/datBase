var gravatar = require('gravatar');
var Ractive = require('ractive');

var user = require('../models/user.js');

module.exports = function(ctx, next) {
  user.currentUser(function (err, user) {
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
      var peeps = $('.content-card-small-avatar')
      for (var i = 0; i < peeps.length; i++) {
        var peep = peeps[i]
        var username = peep.getAttribute('data-user')
        if (!username) continue
        peep.setAttribute('style', "background-image: url('https://github.com/" + username + ".png')")
      }

      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    }
  })

}
