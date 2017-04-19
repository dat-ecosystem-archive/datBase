const relative = require('relative-date')
const html = require('choo/html')

module.exports = (dats, send) => {
  return html`
  <div class="dat-list">
  ${dats.map(function (dat) {
    var modified = dat.updated_at ? dat.updated_at : dat.created_at
    return html`
    <div class="dat-list-item">
    <div class="share-link">
      <a href="/${dat.shortname}" data-no-routing>${dat.shortname}</a></div>
      <p>${dat.title}</p>
      <div class="dat-detail">
        <p>last published ${relative(new Date(modified))}</p>
      </div>
    </div>
    `
  })}
  </div>`
}
