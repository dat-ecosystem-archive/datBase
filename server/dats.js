const Archiver = require('hypercore-archiver')
const mkdirp = require('mkdirp')
const path = require('path')
const level = require('level')
const encoding = require('dat-encoding')
const hyperdrive = require('hyperdrive')
const archiverServer = require('archiver-server')

module.exports = Dats

function Dats (dir) {
  if (!(this instanceof Dats)) return new Dats(dir)
  mkdirp.sync(dir)
  this.archiver = Archiver(dir)
  this.server = archiverServer(this.archiver)
  this.drive = hyperdrive(level(path.join(dir, 'hyperdrive')))
}

Dats.prototype.add = function (key, cb) {
  var self = this
  var buf = encoding.toBuf(key)
  self.archiver.add(buf, {content: false}, function (err) {
    if (err) return cb(err)
    self.archiver.get(buf, function (err, metadata, content) {
      if (err) return cb(err)
      var archive = self.drive.createArchive(buf, {metadata: metadata, content: content, sparse: true})
      return cb(null, archive)
    })
  })
}

Dats.prototype.close = function (cb) {
  this.archiver.close(cb)
}
