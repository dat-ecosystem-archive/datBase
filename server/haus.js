var level = require('level')
var swarm = require('discovery-swarm')
var defaults = require('datland-swarm-defaults')
var hyperdrive = require('hyperdrive')
var lru = require('lru')

module.exports = Haus

function Haus (opts) {
  if (!(this instanceof Haus)) return new Haus(opts)
  if (!opts) opts = {}
  var self = this
  this.file = undefined
  this.db = level(opts.db || 'dat.land')
  this.drive = hyperdrive(this.db)
  this.cache = lru(opts.cacheSize || 100)
  this.sw = swarm(defaults({
    hash: false,
    stream: function (info) {
      var stream = self.drive.replicate()
      if (info.channel) join(info.channel) // we already know the channel, join
      else stream.once('open', join) // wait for the remote to tell us
      return stream

      function join (key) {
        var archive = self.cache.get(key.toString('hex'))
        if (archive) archive.replicate({stream: stream})
      }
    }
  }))

  this.sw.listen(3282)
  this.sw.once('error', function () {
    self.sw.listen(0)
  })
  this.cache.on('evict', function (item) {
    self.sw.leave(Buffer(item.discoveryKey, 'hex'))
    item.value.close()
  })
}

Haus.prototype.getArchive = function (key, cb) {
  var archive = this.cache.get(key)
  if (!archive) {
    archive = this.drive.createArchive(key, {
      sparse: true,
      file: this.file
    })
    this.cache.set(archive.discoveryKey.toString('hex'), archive)
    this.sw.join(archive.discoveryKey)
  }
  return archive
}
