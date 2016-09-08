var introJs = require('intro.js')

var getIntro = function () {
  const intro = introJs.introJs()
  intro.setOptions({
    element: '#intro',
    steps: [
      {
        intro: 'You can create a new dat by clicking <span class="bold nowrap">Create New Dat</span>',
        element: '#js-button-new'
      },
      {
        intro: 'Add some files here',
        element: '#js-button-add'
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
