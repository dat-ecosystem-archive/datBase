var Ractive = require('ractive')
var $ = jQuery = require('jquery')
var bootstrap = require('bootstrap')
var xhr = require('xhr')
var qs = require('querystring')

var gravatar = require('../common/gravatar.js')
var dathubClient = require('../hub')

module.exports = function(ctx, next) {
  dathubClient.users.currentUser(function (err, user) {
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
    message: function (type, text) {
      var ractive = this
      ractive.set('message', {
        type: type,
        text: text
      })
      setTimeout(function() {
        ractive.set('message', null)
      }, 2000)
    },
    onrender: function () {
      var ractive = this

      ractive.on('logout', function (event) {
        xhr({
          uri: '/auth/logout',
          json: true
        }, function (err, resp, json) {
          if (json.loggedOut === true) {
            window.location.reload()
          }
        })
      })

      ractive.on('search', function (event) {
        var query = ractive.get('searchQuery')
        xhr({
          method: 'GET',
          uri: '/search?' + qs.stringify({query: query}),
          json: true,
        }, function (err, res, json) {
          ractive.fire('metadats', json.rows)
        })
      })

      if (user) {
        gravatar('.content-card-small-avatar')
      }

      $('[data-toggle="tooltip"]').tooltip()
    }
  })

}
