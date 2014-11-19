var isUrl = require('is-url')
var debug = require('debug')('publish')

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
            text: resp.message
          })
        }
        ractive.set('metadat', metadat)
      })
    }
  }
}