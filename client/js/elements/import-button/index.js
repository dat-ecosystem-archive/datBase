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
  return html`<label for="import-dat" class="dat-input">
    <input name="import-dat" type="text" placeholder="PREVIEW DAT LINK" onkeydown=${keydown} class="dat-input__input dat-input__input--icon dat-input__input--no-border">
    <div class="dat-input__icon">
      <img src="/public/img/link.svg" />
    </div>
  </label>`
}
