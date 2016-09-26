const path = require('path')
const relative = require('relative-date')
const pretty = require('pretty-bytes')
const html = require('choo/html')

module.exports = function (root, entries) {
  return html`
    <div id="yo-fs">
      <div id="fs">
        <table id="file-widget">
        ${entries.map(function (entry) {
          return listItem(entry)
        })}
        </table>
      </div>
    </div>`
}

function listItem (entry) {
  // XXX: this is copied from yo-fs.
  return html`<tr class='entry ${entry.type}' href="javascript:void(0)">
      <td class="name">${path.basename(entry.name)}</td>
      <td class="modified">${entry.mtime ? relative(entry.mtime) : ''}</td>
      <td class="size">${pretty(entry.length)}</td>
    </tr>`
}
