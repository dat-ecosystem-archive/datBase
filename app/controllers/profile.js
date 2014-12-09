var debug = require('debug')('profile');

var api = require('../api');
var gravatar = require('../common/gravatar.js')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/pages/profile.html'),
    partials: {
      listMetadats: require('../templates/metadat/list.html')
    },
    onrender: function () {
      var ractive = this
      api.users.get(data.handle, function (err, user) {
        if (err) return cb(err)
        ractive.set('user', user)
        gravatar('.content-card-large-avatar')
      })

      api.metadats.query({
        owner_id: data.handle
      }, function (err, metadats) {
        ractive.set('metadats', metadats)
      })
    }
  }
}