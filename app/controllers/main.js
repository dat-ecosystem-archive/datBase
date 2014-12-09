var Ractive = require('ractive');
var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');

var gravatar = require('../common/gravatar.js')
var api = require('../api');

module.exports = function(ctx, next) {
  api.users.currentUser(function (err, user) {
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
        gravatar('.content-card-small-avatar')
      }

      $('[data-toggle="tooltip"]').tooltip()
    }
  })

}
