var introJs = require('intro.js')

var getIntro = function () {
  const intro = introJs.introJs()
  intro.setOptions({
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
  return intro
}

module.exports = {
  namespace: 'help',
  state: {},
  reducers: {
    update: function (data, state) {
      return data
    }
  },
  effects: {
    show: function (data, state, send, done) {
      getIntro().start()
    }
  }
}
