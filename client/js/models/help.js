var intro = require('intro.js')

var getIntro = function () {
  const _intro = intro.introJs()
  _intro.setOptions({
    element: '#intro',
    steps: [
      {
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
  return _intro
}

module.exports = {
  namespace: 'help',
  state: {},
  reducers: {},
  effects: {
    show: function (data, state, send, done) {
      getIntro().start()
    }
  }
}
