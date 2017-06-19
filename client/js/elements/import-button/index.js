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
    <input name="import-dat" type="text" placeholder="Search Dat Link" onkeydown=${keydown} class="dat-input__input dat-input__input--icon">
    <svg class="dat-input__icon pa1">
      <use xlink:href="#daticon-search" />
    </svg>
  </label>`
}
