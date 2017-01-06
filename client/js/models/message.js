var defaultState = {
  message: ''
}

module.exports = {
  namespace: 'message',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.message,
  reducers: {
    update: (data, state) => {
      return {message: data.message, type: data.type}
    },
    clear: (_, state) => {
      return {message: '', type: ''}
    }
  },
  effects: {
    new: (data, state, send, done) => {
      send('message:update', data, function () {
        done()
      })
      setTimeout(function () {
        send('message:update', data, function () {
          send('message:clear', null, done)
        })
      }, 3000)
    },
    success: (message, state, send, done) => {
      send('message:new', {message: message, type: 'success'}, done)
    },
    error: (message, state, send, done) => {
      send('message:new', {message: message, type: 'error'}, done)
    },
    warning: (message, state, send, done) => {
      send('message:new', {message: message, type: 'warning'}, done)
    }
  }
}
