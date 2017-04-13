const html = require('choo/html')
const css = require('sheetify')

var prefix = css`
  :host {
    background-color: var(--color-neutral-04);
  }
`

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
    <div class="mb3 pa1 ${prefix}">
      <div class="share-link">
        <a href="#" onclick=${() => open(dat)}>${dat.name}</a>
      </div>
      <p>${dat.title}</p>
      <div class="dat-detail">
        ${dat.username} |
        ${dat.created_at}
      </div>
    </div>
    `
  })}
  </div>`
}
