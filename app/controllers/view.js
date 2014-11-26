var debug = require('debug')('view')

var Metadat = require('../models/metadat.js')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/view.html'),
    onrender: function () {
      var ractive = this
      var metadatId = data.metadatId

      Metadat.get(metadatId, function (err, resp, metadat) {
        if (err) {
          window.ractive.set('message', {
            type: 'error',
            text: err.message
          })
          return
        }
        ractive.set('metadat', metadat)
      })
    }
  }
}