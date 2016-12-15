const html = require('choo/html')

module.exports = function (props) {
  const keydown = (e) => {
    if (e.keyCode === 13) {
      var link = e.target.value
      e.target.value = ''
      // TODO: basic parsing, validation of archive link before server-render
      link = link.toLowerCase()
      link = link.replace('dat://', '')
      link = link.replace('dat.land/', '').replace(/^(http|https):\/\//, '')
      props.handler(link)
    }
  }
  return html`<div class="dat-import">
    <div class="dat-import--icon">
      <img src="./public/img/link.svg" />
    </div>
    <input type="text" placeholder="Enter Dat Link" onkeydown=${keydown} class="dat-import--input">
  </div>`
}
