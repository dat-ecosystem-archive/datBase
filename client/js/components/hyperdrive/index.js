const html = require('choo/html')
const path = require('path')
const pretty = require('pretty-bytes')
const getArchive = require('./archive.js')

let hyperdriveRenderer
if (!module.parent) {
  console.log('CLIENT')
  hyperdriveRenderer = require('hyperdrive-ui')
} else {
  console.log('SERVER')
  const serverComponents = require('./../../app.js').serverComponents || {}
  hyperdriveRenderer = serverComponents.hyperdrive
}


module.exports = function (state, prev, send) {
  if (module.parent) {
    // XXX: static rendering of hyperdrive list from server side state
    return hyperdriveRenderer(state.archive)
  }
  // XXX: dynamic hyperdrive view using discovery-swarm
  let archive = getArchive(state.archive.key)
  return hyperdriveRenderer(archive, {entries: state.archive.entries})
}
