var defaultState = {
  message: ''
}

module.exports = {
  namespace: 'error',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.error,
  reducers: {
    update: (state, error) => {
      return {message: error ? error.message : ''}
    },
    clear: (state) => {
      return {message: ''}
    }
  },
  effects: {
    new: (state, error, send, done) => {
      send('error:update', error, function () {
        done()
      })
    }
  }
}
