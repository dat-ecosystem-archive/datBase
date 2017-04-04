const Archiver = require('hypercore-archiver')
const mkdirp = require('mkdirp')
const xtend = require('xtend')
const encoding = require('dat-encoding')
const hyperdrive = require('hyperdrive')
const ram = require('random-access-memory')
const pages = require('random-access-page-files')
const Swarm = require('discovery-swarm')
const swarmDefaults = require('datland-swarm-defaults')
const collect = require('collect-stream')

module.exports = Dats

function Dats (dir) {
  if (!(this instanceof Dats)) return new Dats(dir)
  mkdirp.sync(dir)
  this.archiver = Archiver({dir: dir, sparse: true, storage: pages})
  this.swarm = createSwarm(this.archiver)
  this.drive = hyperdrive(this.archiver.db)
  this.archives = {}
}

Dats.prototype.get = function (key, cb) {
  var self = this
  key = encoding.toStr(key)
  var buf = encoding.toBuf(key)
  if (self.archives[key]) return cb(null, self.archives[key])
  self.archiver.add(buf, {content: true}, function (err) {
    if (err) return cb(err)
    self.archiver.get(buf, function (err, metadata, content) {
      if (err) return cb(err)
      if (content) {
        var opts = xtend({metadata: metadata, content: content}, self.opts)
        var archive = hyperdrive(ram, buf, opts)
        self.archives[key] = archive
        return cb(null, archive)
      }
    })
  })
}

Dats.prototype.entries = function (archive, cb) {
  var TIMEOUT = 7000
  var stream = archive.list({live: false, limit: 100})
  var cancelled = false

  var timeout = setTimeout(function () {
    var msg = 'timed out'
    cancelled = true
    return cb(new Error(msg))
  }, TIMEOUT)

  collect(stream, function (err, entries) {
    clearTimeout(timeout)
    if (cancelled) return
    if (err) return cb(err)
    cb(null, entries)
  })
}

Dats.prototype.metadata = function (archive, cb) {
  var self = this
  var dat
  if (!archive.content) dat = {}
  else {
    dat = {
      peers: archive.content.peers.length,
      size: archive.content.bytes
    }
  }
  self.entries(archive, function (err, entries) {
    if (err) return cb(err)
    dat.entries = entries
    var filename = 'dat.json'
    archive.readFile(filename, function (err, metadata) {
      if (err) return cb(null, dat)
      try {
        dat.metadata = metadata ? JSON.parse(metadata.toString()) : undefined
      } catch (e) {
      }
      return cb(null, dat)
    })
  })
}

Dats.prototype.close = function (cb) {
  this.swarm.close(cb)
}

function createSwarm (archiver, opts) {
  if (!archiver) throw new Error('hypercore archiver required')
  if (!opts) opts = {}

  var swarmOpts = swarmDefaults({
    hash: false,
    stream: function () {
      return archiver.replicate()
    }
  })
  var swarm = Swarm(swarmOpts)

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
