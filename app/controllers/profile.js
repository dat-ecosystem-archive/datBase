var debug = require('debug')('profile');

var metadats = require('../models/metadats.js');
var users = require('../models/users.js');

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/pages/profile.html'),
    partials: {
      listMetadats: require('../templates/metadat/list.html')
    },
    onrender: function () {
      var ractive = this
      users.get(data.handle, function (err, user) {
        if (err) return cb(err)
        ractive.set('user', user)
      })

      metadats.query({
        owner_id: data.handle
      }, function (err, metadats) {
        ractive.set('metadats', metadats)
      })
    }
  }
}