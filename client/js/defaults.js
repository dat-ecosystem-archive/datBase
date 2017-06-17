module.exports = function (defaults) {
  return function (state, emitter) {
    for (var key in defaults) {
      state[key] = module.parent ? defaults[key] : window._store[key]
    }
    emitter.emit('render')
  }
}
