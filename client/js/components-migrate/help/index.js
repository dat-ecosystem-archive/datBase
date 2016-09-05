var yo = require('yo-yo')
var intro = require('intro.js')
var button = require('dat-button')

module.exports = function Help () {
  function onclick () {
    var _intro = intro.introJs()
    _intro.setOptions({
      steps: [{
        intro: 'You can create a new dat by clicking <b>Create New Dat</b>'
      },
      {
        intro: 'Drop some files here',
        element: '#add-files'
      },
      {
        intro: 'You can share the dat with this link',
        element: '#share-link',
        position: 'bottom'
      }
    ]})
    _intro.start()
  }
  return yo`<div class="dat-button dat-button--help">${button({text: '? Help', click: onclick})}</div>`
}
