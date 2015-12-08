var Ractive = require('ractive-toolkit')
var gravatar = require('../common/gravatar.js')

module.exports = function (ctx, next) {
  var lock = new Auth0Lock('iJQfH9WkB707jALLeQ07NehjnRXbLDte', 'publicbits.auth0.com')
  window.lock = lock
  var id_token = localStorage.getItem('id_token')
  if (id_token) {
    lock.getProfile(id_token, function (err, profile) {
      if (err) {
        ctx.state.user = null
        return alert('There was an error geting the profile: ' + err.message)
      }
      ctx.state.user = profile
    })
  }

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

      document.getElementById('btn-login').addEventListener('click', function () {
        lock.show({ authParams: { scope: 'openid' } })
      })
      var hash = lock.parseHash(window.location.hash)
      if (hash && hash.id_token) {
        // save the token in the session:
        localStorage.setItem('id_token', hash.id_token)
      }
      if (hash && hash.error) {
        alert('There was an error: ' + hash.error + '\n' + hash.error_description)
      }
      if (ctx.state.user) {
        gravatar('.content-card-avatar')
      }
    }
  })
  next()
}
