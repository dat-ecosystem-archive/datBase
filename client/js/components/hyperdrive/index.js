const html = require('choo/html')
// const serverComponents = process.browser ? {} : require('./../../app.js').serverComponents
// const hyperdriveRenderer = process.browser ? require('hyperdrive-ui') : serverComponents.hyperdrive
const path = require('path')
const pretty = require('pretty-bytes')
const getArchive = require('./archive.js')

let hyperdriveRenderer
if (!module.parent) {
  hyperdriveRenderer = require('hyperdrive-ui')
} else {
  const app = require('./../../app.js')
  const serverComponents = app.serverComponents || {}
  hyperdriveRenderer = serverComponents.hyperdrive
}


module.exports = function (state, prev, send) {
  if (process.browser) {
    // XXX: static rendering of hyperdrive list from server side state
    return hyperdriveRenderer(state)
  }
  // XXX: dynamic hyperdrive view using discovery-swarm
  let archive = getArchive(state.archive.key)
  return hyperdriveRenderer(archive, {entries: state.archive.entries})
}
