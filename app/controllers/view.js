var debug = require('debug')('view')

var api = require('../api')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/view.html'),
    onrender: function () {
      var ractive = this
      var metadatId = data.metadatId

      api.metadats.getById(metadatId, function (err, resp, metadat) {
        if (err) {
          window.ractive.message('error', err.message)
          return
        }
        ractive.set('metadat', metadat)
      })
    }
  }
}