var intro = require('intro.js')

module.exports = Help

function Help (el, clickHandler) {
  if (!(this instanceof Help)) return new Help(el)
  this.$el = document.getElementById(el)
  this.$el.onclick = function () {
    var _intro = intro.introJs()
    _intro.setOptions({
      steps: [{
        intro: 'You can create a new dat by clicking <b>Reset</b>'
      },
      {
        intro: 'Drop some files here',
        element: '#help-text'
      },
      {
        intro: 'You can share the dat with this link',
        element: 'input#share-link',
        position: 'bottom'
      }
    ]})
    _intro.start()
  }
}
