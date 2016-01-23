var Ractive = require('ractive-toolkit')
var Auth0Lock = require('auth0-lock')

module.exports = function (ctx, next) {
  var lock = new Auth0Lock('iJQfH9WkB707jALLeQ07NehjnRXbLDte', 'publicbits.auth0.com')
  window.lock = lock
  var hash = lock.parseHash(window.location.hash)
  if (hash && hash.id_token) {
    // save the token in the session:
    localStorage.setItem('id_token', hash.id_token)
  }
  if (hash && hash.error) {
    throw new Error(hash.error)
  }
  var id_token = localStorage.getItem('id_token')
  if (id_token) {
    lock.getProfile(id_token, function (err, profile) {
      if (err) {
        ctx.state.user = null
        localStorage.removeItem('id_token')
      } else {
        ctx.state.user = profile
      }
      main()
    })
  } else main()

  function main () {
    window.ractive = new Ractive({
      el: '#main',
      template: require('../templates/main.html'),
      data: function () {
        return {
          user: ctx.state.user
        }
      },
      message: function (type, text) {
        var self = this
        self.set('message', {
          type: type,
          text: text
        })
        setTimeout(function () {
          self.set('message', null)
        }, 2000)
      },
      onrender: function () {
        var self = this

        self.set('sidebar', true)
        self.set('path', ctx.path)

        self.on('toggle-sidebar', function (event) {
          var sidebar = self.get('sidebar')
          self.set('sidebar', !sidebar)
        })

        var login_btn = document.getElementById('btn-login')
        if (login_btn) login_btn.addEventListener('click', function () {
          lock.show({ authParams: { scope: 'openid' } })
        })
      }
    })
    next()
  }

}
