module.exports = ResetButton

function ResetButton (el, clickHandler) {
  if (!(this instanceof ResetButton)) return new ResetButton(el, clickHandler)
  this.$el = document.getElementById(el)
  this.$el.onclick = function () {
    clickHandler(null)
  }
}
