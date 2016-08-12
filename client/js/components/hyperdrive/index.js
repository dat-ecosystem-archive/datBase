const html = require('choo/html')
const path = require('path')
const from = require('from2')
const getServerComponent = module.parent ? require('./../../app.js').getServerComponent : {}
let hyperdriveRenderer = module.parent ? getServerComponent('hyperdrive') : require('hyperdrive-ui')

module.exports = function (state, prev, send) {
  if (!state.archive.instance) {
    state.archive.instance = {
      list: function () {
        return from.obj(state.archive.entries)
      }
    }
  }
  return hyperdriveRenderer(state.archive.instance, {entries: state.archive.entries})
}
