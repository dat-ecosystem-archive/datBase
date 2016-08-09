const html = require('choo/html')
var hyperdriveUI;
if (!module.parent) hyperdriveUI = require('hyperdrive-ui')
const path = require('path')
const pretty = require('pretty-bytes')
const getArchive = require('./archive.js')

module.exports = function (state, prev, send) {
  if (module.parent) {
    // static rendering of hyperdrive list from server side state
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

  // dynamic hyperdrive view using discovery-swarm
  var archive = getArchive(state.archive.key)
  return hyperdriveUI(archive, {entries: state.archive.entries})
}


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
