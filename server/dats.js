const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const hyperdiscovery = require('hyperdiscovery')
const encoding = require('dat-encoding')
const hyperdrive = require('hyperdrive')

module.exports = Dats

function Dats (dir) {
  if (!(this instanceof Dats)) return new Dats(dir)
  mkdirp.sync(dir)
  this.archives = []
}

Dats.prototype.get = function (key, opts, cb) {
  var self = this
  if (typeof opts === 'function') return this.get(key, {}, opts)
  key = encoding.toStr(key)
  var buf = encoding.toBuf(key)
  var archive = hyperdrive('./archiver/ ' + key, buf, {sparse: true})
  archive.once('ready', function () {
    var swarm = hyperdiscovery(archive)
    archive.swarm = swarm
    self.archives.push(archive)
    return cb(null, archive)
  })
}

Dats.prototype.metadata = function (archive, opts, cb) {
  if (typeof opts === 'function') return this.metadata(archive, {}, opts)
  var dat
  if (!archive.content) dat = {}
  else {
    dat = {
      peers: archive.content.peers.length,
      size: archive.content.byteLength
    }
  }
  var cancelled = false

  var timeout = setTimeout(function () {
    var msg = 'timed out'
    if (cancelled) return
    cancelled = true
    return cb(new Error(msg), dat)
  }, opts.timeout)

  function done (err, dat) {
    clearTimeout(timeout)
    if (cancelled) return
    cancelled = true
    return cb(err, dat)
  }

  archive.metadata.update()
  archive.tree.list('/', {nodes: true}, function (err, entries) {
    for (var i in entries) {
      var entry = entries[i]
      entries[i] = entry.value
      entries[i].name = entry.name
      entries[i].type = 'file'
    }
    dat.entries = entries
    if (err || cancelled) return done(err, dat)
    var filename = 'dat.json'
    archive.stat(filename, function (err, entry) {
      if (err || cancelled) return done(null, dat)
      archive.readFile(filename, function (err, metadata) {
        if (err || cancelled) return done(err, dat)
        try {
          dat.metadata = metadata ? JSON.parse(metadata.toString()) : undefined
        } catch (e) {
        }
        dat.peers = archive.content ? archive.content.peers.length : 0
        dat.size = archive.content.byteLength
        return done(null, dat)
      })
    })
  })
}

Dats.prototype.close = function (cb) {
  var tasks = []
  for (var i in this.archives) {
    var archive = this.archives[i]
    var swarm = archive.swarm
    tasks.push(function (next) {
      swarm.leave(archive.discoveryKey)
      swarm.destroy(next)
    })
  }

  parallel(tasks, cb)
}
