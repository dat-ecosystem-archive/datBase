module.exports = {
  namespace: 'archive',
  state: {
    key: _resolveLocationData().key,
    file: _resolveLocationData().file
  },
  reducers: {
    update: (data, state) => {
      return {
        archiveKey: _resolveLocationData().key,
        file: _resolveLocationData().file
      }
    }
  }
}

function _resolveLocationData (data, state) {
  const keypath = window.location.hash.substr(1).match('([^/]+)(/?.*)')
  return {
    key: keypath ? keypath[1] : null,
    file: keypath ? keypath[2] : null
  }
}

