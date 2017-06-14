const mkdirp = require('mkdirp')
const debug = require('debug')('dat-registry')
const ram = require('random-access-memory')
const resolve = require('dat-link-resolve')
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

Dats.prototype.get = function (link, opts, cb) {
  var self = this
  if (typeof opts === 'function') return this.get(link, {}, opts)
  resolve(link, function (err, key) {
    if (err) {
      console.trace(err)
      return cb(new Error('Invalid key'))
    }
    debug('got key', key)
    self.ar.get(key, function (err, metadata, content) {
      if (!err) return cb(null, hyperdrive(ram, {metadata, content}), key)
      if (err.message === 'Could not find feed') {
        self.ar.add(key, function (err) {
          if (err) return cb(err)
          return self.get(key, opts, cb)
        })
      } else return cb(err)
    })
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
    return done(new Error(msg), dat)
  }, parseInt(opts.timeout))

  function done (err, dat) {
    clearTimeout(timeout)
    if (cancelled) return
    cancelled = true
    return cb(err, dat)
  }
  archive.metadata.update()
  archive.tree.list('/', {nodes: true}, function (err, entries) {
    if (err) {
      return archive.metadata.update(function () {
        if (cancelled) return
        cancelled = true
        self.metadata(archive, opts, cb)
      })
    }
    if (cancelled) return done(null, dat)

    for (var i in entries) {
      var entry = entries[i]
      entries[i] = entry.value
      entries[i].name = entry.name
      entries[i].type = 'file'
    }
    dat.entries = entries
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
