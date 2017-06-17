const html = require('choo/html')

module.exports = function (emit) {
  const keydown = (e) => {
    if (e.keyCode === 13) {
      var link = e.target.value
      e.target.value = ''
      emit('archive:view', link)
    }
  }
  return html`<label for="import-dat" class="dat-input">
    <input name="import-dat" type="text" placeholder="Search" onkeydown=${keydown} class="dat-input__input dat-input__input--icon">
    <div class="dat-input__icon">
      <img src="/public/img/link.svg" />
    </div>
  </label>`
}
