var debug = require('debug')('browse')

var Dat = require('./Dat.js')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/browse.html'),
    onrender: function () {
      var ractive = this

      Dat.all(function (err, resp, metadats) {
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