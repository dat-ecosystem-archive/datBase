const html = require('choo/html')
const path = require('path')
const pretty = require('pretty-bytes')
let hyperdriveRenderer

module.exports = function (state, prev, send) {
  if (module.parent) {
    const serverComponents = require('./../../app.js').serverComponents || {}
    hyperdriveRenderer = serverComponents.hyperdrive
    // XXX: static rendering of hyperdrive list from server side state
    return hyperdriveRenderer(state.archive)
  }
  // XXX: dynamic hyperdrive view using discovery-swarm
  hyperdriveRenderer = require('hyperdrive-ui')

  send('archive:join', function (err, archive) {
    return hyperdriveRenderer(archive, {entries: state.archive.entries})
  })
}
