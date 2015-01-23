var debug = require('debug')('browse')

var dathubClient = require('../hub')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/browse.html'),
    components: {
      listMetadats: require('../components/list.js')
    },
    onrender: function () {
      var ractive = this

      dathubClient.metadats.all(function (err, metadats) {
        if (err) {
          ractive.set('metadats', [])
        }
        ractive.set('metadats', metadats.data)
      })
    }
  }
}