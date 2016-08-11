const html = require('choo/html')

module.exports = function (state) {
  return html`
    <div id="yo-fs">
      <div id="fs">
        <ul id="file-widget">
        ${state.archive.entries.map(function (entry) {
          return listItem(entry)
        })}
        </ul>
      </div>
    </div>`
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
