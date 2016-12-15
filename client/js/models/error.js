var defaultState = {
  message: ''
}

module.exports = {
  namespace: 'error',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
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
      setTimeout(function () {
        send('error:update', error, function () {
          send('error:clear', null, done)
        })
      }, 3000)
    }
  }
}
