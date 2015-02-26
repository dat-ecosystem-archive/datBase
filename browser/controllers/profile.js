var debug = require('debug')('profile');
var page = require('page')

var dathub = require('../hub');
var gravatar = require('../common/gravatar.js')

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
        if (err) return cb(err)
        ractive.set('user', user)
        gravatar('.content-card-large-avatar')
      })

      dathub.metadats.query({
        owner_id: data.handle
      }, function (err, resp, metadats) {
        ractive.set('metadats', metadats)
      })

    }
  }
}