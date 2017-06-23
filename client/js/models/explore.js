const api = require('../api')()
const xtend = require('xtend')

module.exports = function (state, emitter) {
  emitter.on('explore:update', function (data) {
    state.explore = xtend(state.explore, data)
    emitter.emit('render')
  })
  emitter.on('explore:nextPage', function (data) {
    var newOffset = state.explore.offset + state.explore.limit
    api.dats.get({offset: newOffset, limit: state.explore.limit}, function (err, resp, json) {
      if (err) emitter.emit('message:error', err.message)
      emitter.emit('explore:update', {offset: newOffset, data: json})
    })
  })
}
