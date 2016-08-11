const html = require('choo/html')
const path = require('path')
const pretty = require('pretty-bytes')
const getArchive = require('./archive.js')
var hyperdriveRenderer

module.exports = function (state, prev, send) {
  if (module.parent) {
    const serverComponents = require('./../../app.js').serverComponents || {}
    hyperdriveRenderer = serverComponents.hyperdrive
    // XXX: static rendering of hyperdrive list from server side state
    return hyperdriveRenderer(state.archive)
  }
  // XXX: dynamic hyperdrive view using discovery-swarm
  hyperdriveRenderer = require('hyperdrive-ui')
  let archive = getArchive(state.archive.key)
  return hyperdriveRenderer(archive, {entries: state.archive.entries})
}
