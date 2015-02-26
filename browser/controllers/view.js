var debug = require('debug')('view')
var ZeroClipboard = require('zeroclipboard')

var dathubClient = require('../hub')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/view.html'),
    onrender: function () {
      var ractive = this
      var metadatId = data.metadatId

      dathubClient.metadats.getById(metadatId, function (err, resp, metadat) {
        if (err) {
          window.ractive.message('error', err.message)
          return
        }
        ractive.set('metadat', metadat)
        var copyButton = document.getElementById("copy-button");
        // copyButton.setAttribute('data-clipboard-text', metadat.url);
        var zeroClipboardClient = new ZeroClipboard(document.getElementById("copy-button"));
      })

      ractive.on('edit.*', function (event) {
        // event.name one of 'description', 'readme'
        ractive.set(event.name, true)
        event.original.preventDefault()
      })

      ractive.on('save', function (event, whatChanged) {
        var metadat = ractive.get('metadat')
        dathubClient.metadats.update(metadatId, metadat, function (err, resp, metadat) {
          if (err) console.error(err)
          ractive.set('edit.' + whatChanged, false)
        })
        event.original.preventDefault()
      })
    }
  }
}