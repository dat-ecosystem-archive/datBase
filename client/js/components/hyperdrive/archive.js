const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const swarm = require('hyperdrive-archive-swarm')

module.exports = function (key) {
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(key)
  var sw = swarm(archive)
  return archive
}
