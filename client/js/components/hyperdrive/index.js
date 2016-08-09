const html = require('choo/html')
var hyperdriveUI;
if (!module.parent) hyperdriveUI = require('hyperdrive-ui')
const hyperdrive = require('hyperdrive')
const memdb = require('memdb')
const swarm = require('hyperdrive-archive-swarm')

module.exports = function (state, prev, send) {
  if (module.parent) {
    return html`
      ${state.archive.entries.map(function (entry){
        return entry.name
      })}
    `
  }
  console.log('here')
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(state.archive.key)
  var sw = swarm(archive)
  console.log(state.archive.entries)
  return hyperdriveUI(archive, {entries: state.archive.entries})
}
