var memdb = require('memdb')
var hyperdrive = require('hyperdrive')
var swarm = require('hyperdrive-archive-swarm')

module.exports = Haus

function Haus (key, opts) {
  if (!(this instanceof Haus)) return new Haus(key, opts)
  if (!opts) opts = {}
  this.db = memdb()
  this.drive = hyperdrive(this.db)
  this.archive = this.drive.createArchive(key)
  this.swarm = swarm(this.archive)
}

Haus.prototype.close = function () {
  this.archive.close()
  this.swarm.close()
  this.db.close()
}
