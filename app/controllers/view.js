var debug = require('debug')('view')

var Dat = require('./Dat.js')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/view.html'),
    onrender: function () {
      var ractive = this
      var metadatId = data.metadatId

      Dat.get(metadatId, function (err, resp, metadat) {
        if (err) {
          window.ractive.set('message', {
            type: 'error',
            text: err.message
          })
        }
        ractive.set('metadat', metadat)
      })
    }
  }
}