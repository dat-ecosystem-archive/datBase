var debug = require('debug')('profile');

var dathub = require('../hub');
var gravatar = require('../common/gravatar.js')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/pages/profile.html'),
    components: {
      listMetadats: require('../components/list.js')
    },
    onrender: function () {
      var ractive = this
      dathub.users.get(data.handle, function (err, user) {
        if (err) return cb(err)
        ractive.set('user', user)
        gravatar('.content-card-large-avatar')
      })

      dathub.metadats.query({
        owner_id: data.handle
      }, function (err, metadats) {
        ractive.set('metadats', metadats)
      })

    }
  }
}