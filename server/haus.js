const encoding = require('dat-encoding')
var level = require('level')
var hyperdrive = require('hyperdrive')
var hyperhealth = require('hyperhealth')

module.exports = Haus

function Haus (key, opts) {
  if (!(this instanceof Haus)) return new Haus(key, opts)
  if (typeof opts === 'function') return new Haus(key, {}, opts)
  if (!opts) opts = {}
  key = encoding.toBuf(key)
  this.db = level()
  this.drive = hyperdrive(this.db)
  this.archive = this.drive.createArchive(key, {sparse: true, live: true})
  this.health = hyperhealth(this.archive, opts)
  this.swarm = this.health.swarm
}

Haus.prototype.close = function (cb) {
  var self = this
  this.swarm.close(function () {
    self.archive.close(function () {
      self.db.close(cb)
    })
  })
}
