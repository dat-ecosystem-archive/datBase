var debug = require('debug')('browse')

var metadats = require('../models/metadats.js')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/browse.html'),
    partials: {
      listMetadats: require('../templates/metadat/list.html')
    },
    onrender: function () {
      var ractive = this

      metadats.all(function (err, metadats) {
        if (err) {
          ractive.set('metadats', [])
        }
        ractive.set('metadats', metadats)
      })
    }
  }
}