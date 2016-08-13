const from = require('from2')

if (module.parent) {
  let hyperdriveRenderer = require('./../../app.js').getServerComponent('hyperdrive')

  module.exports = function (state, prev, send) {
    return hyperdriveRenderer({entries: state.archive.entries})
  }
} else {
  module.exports = function (state, prev, send) {
    if (!state.archive.instance) {
      state.archive.instance = {
        list: function () {
          return from.obj(state.archive.entries)
        }
      }
    }
    return require('hyperdrive-ui')(state.archive.instance, {entries: state.archive.entries})
  }
}
