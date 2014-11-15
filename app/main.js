var gravatar = require('gravatar');
var Ractive = require('ractive');

var user = require('./user.js');

module.exports = function(ctx, cb) {
  user.get(function (err, user) {
    ctx.state.user = user
    render(user)
    cb()
  })
}

function render(user) {
  var ractive = new Ractive({
    el: '#main',
    template: require('./templates/main.html'),
    data: {
      user: user
    }
  })

  var peeps = $('.content-card-small-avatar')
  for (var i = 0; i < peeps.length; i++) {
    var peep = peeps[i]
    var username = peep.getAttribute('data-user')
    if (!username) continue
    peep.setAttribute('style', "background-image: url('https://github.com/" + username + ".png')")
  }
}
