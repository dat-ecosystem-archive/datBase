const Archiver = require('hypercore-archiver')
const mkdirp = require('mkdirp')
const encoding = require('dat-encoding')
const hyperdrive = require('hyperdrive')
const Swarm = require('discovery-swarm')
const swarmDefaults = require('datland-swarm-defaults')
const hyperhttp = require('hyperdrive-http')

module.exports = Dats

function Dats (dir) {
  if (!(this instanceof Dats)) return new Dats(dir)
  mkdirp.sync(dir)
  this.archiver = Archiver({dir: dir, sparse: true})
  this.swarm = createSwarm(this.archiver)
  this.drive = hyperdrive(this.archiver.db)
  this.archives = {}
  this.http = hyperhttp(this.get)
}

Dats.prototype.get = function (key, cb) {
  var self = this
  key = encoding.toStr(key)
  var buf = encoding.toBuf(key)
  if (self.archives[key]) return cb(null, self.archives[key])
  var done = false
  self.archiver.add(buf, {content: true}, function (err) {
    if (err) return cb(err)
    self.archiver.get(buf, function (err, metadata, content) {
      if (err) return cb(err)
      if (done) return
      done = true
      var archive = self.drive.createArchive(buf, {metadata: metadata, content: content})
      self.archives[key] = archive
      return cb(null, archive)
    })
  })
}

Dats.prototype.file = function (key, filename, cb) {
  var self = this
  self.get(key, function (err, archive) {
    if (err) return cb(err)
    archive.get(filename, function (err, entry) {
      if (err) return cb(err)
      archive.download(entry, true, cb) // second arg = force download
    })
  })
}

Dats.prototype.close = function (cb) {
  this.swarm.close(cb)
}

function createSwarm (archiver, opts) {
  if (!archiver) throw new Error('hypercore archiver required')
  if (!opts) opts = {}

  var timeouts = []
  var swarmOpts = swarmDefaults({
    hash: false,
    stream: function () {
      return archiver.replicate()
    }
  })
  var swarm = Swarm(swarmOpts)
  swarm.once('close', function () {
    timeouts.forEach(function (timeout) {
      clearTimeout(timeout)
    })
  })

  archiver.changes(function (err, feed) {
    if (err) throw err
    swarm.join(feed.discoveryKey)
  })

  archiver.list().on('data', function (key) {
    serveArchive(key)
  })
  archiver.on('add', serveArchive)
  archiver.on('remove', function (key) {
    swarm.leave(archiver.discoveryKey(key))
  })

  return swarm

  function serveArchive (key) {
    swarm.join(archiver.discoveryKey(key))
  }
}
