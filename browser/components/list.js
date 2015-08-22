var Ractive = require('ractive')

var MetadatList = Ractive.extend({
  template: require('./list.html'),
  onrender: function () {
    var ractive = this
    this.on('toggleMetadat', function (event) {
      var metadat = event.context
      metadat.open = !metadat.open
    });
  },
  data: function () { return { metadats: [] } }
});

module.exports = MetadatList