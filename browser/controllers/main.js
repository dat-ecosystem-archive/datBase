var Ractive = require('ractive')
var $ = jQuery = require('jquery')
var bootstrap = require('bootstrap')
var xhr = require('xhr')
var page = require('page')

var gravatar = require('../common/gravatar.js')
var dathubClient = require('../hub')

var tabs = require('tabs');

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

        $('.sidebar__nav a:not(.no-link)').each(function (i, el) {
          el = $(el)
          var href = el.attr('href')
          if (href === ctx.path) {
            el.find('li').addClass('active')
          }
          else {
            el.find('li').removeClass('active')
          }
        })

        /** EVENTS **/

        self.on('toggle-sidebar', function (event) {
          var sidebar = self.get('sidebar')
          self.set('sidebar', !sidebar)
        })

        /** END EVENTS **/

        if (user) {
          gravatar('.content-card-avatar')
        }

        $('.tab-container').map(function (i, el) {
          tabs($(el))
        })

        $('[data-toggle="tooltip"]').tooltip()
      }
    })
    next()
  })
}