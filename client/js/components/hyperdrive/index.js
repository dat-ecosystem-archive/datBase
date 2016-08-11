const html = require('choo/html')
const path = require('path')
const pretty = require('pretty-bytes')
const getArchive = require('./archive.js')
const getServerComponent = module.parent ? require('./../../app.js').getServerComponent : {}
const hyperdriveRenderer = module.parent ? getServerComponent('hyperdrive') : require('hyperdrive-ui')

module.exports = function (state, prev, send) {
  if (module.parent) {
    // XXX: static rendering of hyperdrive list from server side state
    return hyperdriveRenderer(state.archive)
  }
  // XXX: dynamic hyperdrive view using discovery-swarm
  let archive = getArchive(state.archive.key)
  return hyperdriveRenderer(archive, {entries: state.archive.entries})
}
