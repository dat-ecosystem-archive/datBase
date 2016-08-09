const html = require('choo/html')
var hyperdriveUI;
if (!module.parent) hyperdriveUI = require('hyperdrive-ui')
const path = require('path')
const hyperdrive = require('hyperdrive')
const pretty = require('pretty-bytes')
const memdb = require('memdb')
const swarm = require('hyperdrive-archive-swarm')

function listItem (entry) {
  // XXX: this is copied from yo-fs.
  return html`<li class='entry ${entry.type}'>
      <a href="javascript:void(0)">
        <span class="name">${path.basename(entry.name)}</span>
        <span class="modified">${entry.mtime ? relative(entry.mtime) : ''}</span>
        <span class="size">${pretty(entry.length)}</span>
      </a>
    </li>`
  }

module.exports = function (state, prev, send) {
    // static rendering of hyperdrive list from server side state
  if (module.parent) {
    return html`
      <div id="yo-fs">
        <div id="fs">
          <ul id="file-widget">
          ${state.archive.entries.map(function (entry) {
            return listItem(entry)
          })}
          </ul>
        </div>
      </div>
    `
  }
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(state.archive.key)
  var sw = swarm(archive)
  return hyperdriveUI(archive, {entries: state.archive.entries})
}
