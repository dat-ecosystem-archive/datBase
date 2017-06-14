const html = require('choo/html')

module.exports = function (props) {
  const keydown = (e) => {
    if (e.keyCode === 13) {
      var link = e.target.value
      e.target.value = ''
      props.handler(link)
    }
  }
  return html`<label for="import-dat" class="dat-input">
    <input name="import-dat" type="text" placeholder="Preview Dat Link" onkeydown=${keydown} class="dat-input__input dat-input__input--icon">
    <div class="dat-input__icon">
      <img src="/public/img/link.svg" />
    </div>
  </label>`
}
