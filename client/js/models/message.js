var defaultState = {
  message: ''
}

module.exports = {
  namespace: 'message',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
  reducers: {
    update: (message, state) => {
      return {message: message}
    },
    clear: (_, state) => {
      return {message: ''}
    }
  },
  effects: {
    new: (message, state, send, done) => {
      send('message:update', message, function () {
        done()
      })
      setTimeout(function () {
        send('message:update', message, function () {
          send('message:clear', null, done)
        })
      }, 3000)
    }
  }
}
