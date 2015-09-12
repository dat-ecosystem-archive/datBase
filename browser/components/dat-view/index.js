var debug = require('debug')('view')
var tabs = require('tabs')

var dathubClient = require('../../hub')

module.exports = function (data) {
  return {
    data: data,
    template: require('./index.html'),
    onrender: function () {
      var self = this
      var metadatId = data.metadatId
      self.set('refreshing', false)

      dathubClient.metadats.getById(metadatId, function (err, resp, metadat) {
        if (err) return window.ractive.message('error', err.message)
        self.set('metadat', metadat)
        window.ractive.set('metadat', metadat)
      })

      self.on('refresh', function (event) {
        var metadat = self.get('metadat')
        self.set('refreshing', true)
        dathubClient.metadats.refresh(metadatId, function (err, resp, metadat) {
          if (err) return window.ractive.message('error', err.message)
          self.set('refreshing', false)
          self.set('metadat', metadat)
        })
      })
    }
  }
}