var debug = require('debug')('browse')

var Metadat = require('../models/metadat.js')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/browse.html'),
    onrender: function () {
      var ractive = this

      Metadat.all(function (err, resp, metadats) {
        if (err) {
          window.ractive.set('message', {
            type: 'error',
            text: err.message
          })
          return
        }
        ractive.set('metadats', metadats)
      })
    }
  }
}