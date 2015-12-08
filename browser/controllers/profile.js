var page = require('page')
var xhr = require('xhr')

var dathub = require('../hub')

// Controller for:
// /profile
// /profile/:handle

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/pages/profile.html'),
    components: {
      listMetadats: require('../components/list.js')
    },
    onrender: function () {
      var ractive = this
      // if sent to /profile without /:handle
      if (!data.handle) {
        // if logged in
        if (data.user) return page('/profile/' + data.user.handle)
        // redirect to home if didn't supply a user and not logged in
        else return page('/')
      }

      dathub.users.get(data.handle, function (err, resp, user) {
        if (err) return window.ractive.message('error', err.message)
        ractive.set('profile', user)
      })

      dathub.metadats.query({
        owner_id: data.handle
      }, function (err, resp, metadats) {
        if (err) return window.ractive.message('error', err.message)
        ractive.set('metadats', metadats)
      })

      ractive.on('logout', function (event) {
        localStorage.removeItem('id_token')
        page('/')
      })
    }
  }
}
