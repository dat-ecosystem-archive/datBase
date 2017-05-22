const html = require('choo/html')
const copyButton = require('./copy-button')
const relativeDate = require('relative-date')

module.exports = (state, prev, send) => {
  var dats = state.list.data || []
  function open (dat) {
    var shortname = `${dat.username}/${dat.name}`
    window.location.href = '/' + shortname
  }
  return html`
  <div>
  ${dats.map(function (dat) {
    return html`
    <div class="mb3 flex items-center bg-neutral-04 hover-bg-neutral-10 pointer">
      <div class="flex-auto pv2 pl2" onclick=${() => open(dat)}>
        <div>
          <h2 class="f4 dib mb0">${dat.name}</h2>
        </div>
        ${dat.title}
        <div class="f6 color-neutral-60">
          <span class="mr1">
            ${dat.username}
          </span>
          <span>
            updated ${relativeDate(new Date(dat.created_at))}
          </span>
        </div>
      </div>
      <div class="flex-none pv2">
        ${copyButton(dat.url, send)}
      </div>
    </div>
    `
  })}
  </div>`
}
