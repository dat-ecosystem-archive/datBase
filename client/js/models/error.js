var defaultState = {
  message: ''
}

module.exports = {
  namespace: 'error',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.error,
  reducers: {
    update: (error, state) => {
      return {message: error ? error.message : ''}
    },
    clear: (_, state) => {
      return {message: ''}
    }
  },
  effects: {
    new: (error, state, send, done) => {
      send('error:update', error, function () {
        done()
      })
    }
  }
}
