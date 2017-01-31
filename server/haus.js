var hyperdrive = require('hyperdrive')

module.exports = Haus

function Haus (opts) {
  if (!(this instanceof Haus)) return new Haus(opts)
  if (!opts) opts = {}
  this.drive = hyperdrive(opts.cachedb)
}

Haus.prototype.close = function (cb) {
  var self = this
  self.drive.close(cb)
}
