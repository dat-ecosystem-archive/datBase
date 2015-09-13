var Ractive = require('ractive')
var dathubClient = require('../hub')

var MetadatList = Ractive.extend({
  template: require('./list.html'),
  onrender: function () {
    var self = this

    self.on('refresh', function (event, i) {
      event.original.preventDefault()
      self.set('refreshing', true)
      var metadats = self.get('metadats')
      dathubClient.metadats.refresh(metadats[i].id, function (err, resp, metadat) {
        if (err) return window.ractive.message('error', err.message)
        self.set('refreshing', false)
        metadats[i] = metadat
        self.set('metadats', metadats)
      })
    })

  },
  data: function () { return { metadats: [] } }
});

module.exports = MetadatList