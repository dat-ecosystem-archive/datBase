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

      dathubClient.metadats.getById(metadatId, function (err, metadat) {
        if (err) {
          window.ractive.message('error', err.message)
          return
        }
        ractive.set('metadat', metadat)
        var copyButton = document.getElementById("copy-button");
        // copyButton.setAttribute('data-clipboard-text', metadat.url);
        var zeroClipboardClient = new ZeroClipboard(document.getElementById("copy-button"));
      })
    }
  }
}