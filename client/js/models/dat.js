const swarm = require('hyperdrive-archive-swarm')
var noop = function () {}

module.exports = function (drive, key, signalhub, send) {
  var timer
  var archive = drive.createArchive(key, {live: true, sparse: true})
  var sw = swarm(archive, {signalhub: signalhub})
  sw.on('connection', function (conn) {
    send('archive:updatePeers', noop)
    conn.on('close', function () {
      send('archive:updatePeers', noop)
    })
  })
  archive.on('upload', function (data) {
    send('archive:updateUploaded', data.length, noop)
    if (timer) window.clearTimeout(timer)
    timer = setTimeout(() => send('archive:update', {uploadSpeed: 0, downloadSpeed: 0}, noop), 3000)
  })
  archive.on('download', function (data) {
    send('archive:updateDownloaded', data.length, noop)
    send('archive:updateMetadata', {}, noop)
    if (timer) window.clearTimeout(timer)
    timer = setTimeout(() => send('archive:update', {uploadSpeed: 0, downloadSpeed: 0}, noop), 3000)
  })
  archive.open(function () {
    if (archive.content) {
      archive.content.get(0, function (data) {
        // XXX: Hack to fetch a small bit of data so size properly updates
      })
    }
    send('archive:updateMetadata', {}, noop)
  })
  return {
    swarm: sw,
    archive: archive
  }
}
