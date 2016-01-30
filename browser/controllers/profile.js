var page = require('page')

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
      if (!data.nickname) {
        // if logged in
        console.log(data.user)
        if (data.user) return page('/' + data.user.nickname)
        // redirect to home if didn't supply a user and not logged in
        else return page('/')
      }

      if (!data.user) {
        dathub.users.get(data.nickname, function (err, resp, user) {
          if (err) return window.ractive.message('error', err.message)
          ractive.set('user', user)
        })
      }

      dathub.metadats.query({
        owner_id: data.nickname
      }, function (err, resp, metadats) {
        if (err) return window.ractive.message('error', err.message)
        console.log('metadats', metadats)
        ractive.set('metadats', metadats)
      })

      ractive.on('logout', function (event) {
        localStorage.removeItem('id_token')
        window.location.href = '/'
      })
    }
  }
}
