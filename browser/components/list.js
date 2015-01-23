var Ractive = require('ractive')


var MetadatList = Ractive.extend({
  template: require('./list.html'),
  onrender: function () {
    var ractive = this
    this.on('toggleMetadat', function (metadat) {
      metadat.closed = !metadat.closed
    });
  },
  data: { metadats: [] }
});

module.exports = MetadatList