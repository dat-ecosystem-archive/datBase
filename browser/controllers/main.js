var Ractive = require('ractive')
var xhr = require('xhr')
var page = require('page')
var dom = require('dom')
var gravatar = require('../common/gravatar.js')
var dathubClient = require('../hub')

module.exports = function (ctx, next) {
  dathubClient.users.currentUser(function (err, resp, user) {
    if (err) ctx.state.user = null
    ctx.state.user = user

    window.ractive = new Ractive({
      el: '#main',
      template: require('../templates/main.html'),
      data: function () {
        return {
          user: user
        }
      },
      message: function (type, text) {
        var self = this
        self.set('message', {
          type: type,
          text: text
        })
        setTimeout(function() {
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

        if (user) {
          gravatar('.content-card-avatar')
        }

      }
    })
    next()
  })
}