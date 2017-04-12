const html = require('choo/html')

module.exports = (state, prev, send) => {
  var dats = state.list.data || []
  function open (dat) {
    var shortname = `${dat.username}/${dat.name}`
    window.location.href = '/' + shortname
  }
  return html`
  <div class="dat-list">
  ${dats.map(function (dat) {
    var shortname = `${dat.username}/${dat.name}`
    return html`
    <div class="dat-list-item">
    <div class="share-link"><a href="#" onclick=${() => open(dat)}>${shortname}</a></div>
      <p>${dat.title}</p>
      <div class="dat-detail">
        <p>${dat.created_at}</p>
      </div>
    </div>
    `
  })}
  </div>`
}
