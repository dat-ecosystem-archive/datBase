const mkdirp = require('mkdirp')
const ram = require('random-access-memory')
const encoding = require('dat-encoding')
const hyperdrive = require('hyperdrive')
const archiver = require('hypercore-archiver')
const swarm = require('hypercore-archiver/swarm')

module.exports = Dats

function Dats (dir) {
  if (!(this instanceof Dats)) return new Dats(dir)
  mkdirp.sync(dir)
  this.ar = archiver(dir, {sparse: true})
  this.swarm = swarm(this.ar)
}

Dats.prototype.get = function (key, opts, cb) {
  var self = this
  if (typeof opts === 'function') return this.get(key, {}, opts)
  key = encoding.toStr(key)
  this.ar.add(key, function () {
  })
  self.ar.get(key, function (err, metadataFeed, contentFeed) {
    if (err) return cb(err)
    return cb(null, hyperdrive(ram, {metadata: metadataFeed, content: contentFeed}))
  })
}

Dats.prototype.metadata = function (archive, opts, cb) {
  var self = this
  if (typeof opts === 'function') return self.metadata(archive, {}, opts)
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
  archive.tree.list('/', {nodes: true}, function (err, entries) {
    if (err) {
      return archive.metadata.update(function () {
        cancelled = true
        self.metadata(archive, opts, cb)
      })
    }
    for (var i in entries) {
      var entry = entries[i]
      entries[i] = entry.value
      entries[i].name = entry.name
      entries[i].type = 'file'
    }
    dat.entries = entries
    if (cancelled) return done(null, dat)
    var filename = 'dat.json'
    archive.stat(filename, function (err, entry) {
      if (err || cancelled) return done(null, dat)
      archive.readFile(filename, function (err, metadata) {
        if (err || cancelled) return done(null, dat)
        try {
          dat.metadata = metadata ? JSON.parse(metadata.toString()) : undefined
        } catch (e) {
          err = new Error('dat.json file malformed')
        }
        dat.peers = archive.content ? archive.content.peers.length : 0
        dat.size = archive.content.byteLength
        return done(err, dat)
      })
    })
  })
}

Dats.prototype.close = function (cb) {
  this.swarm.destroy(cb)
}
