var defaultState = {
  message: ''
}

module.exports = {
  namespace: 'message',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.message,
  reducers: {
    update: (state, data) => {
      return {message: data.message, type: data.type}
    },
    clear: (state) => {
      return {message: '', type: ''}
    }
  },
  effects: {
    new: (state, data, send, done) => {
      send('message:update', data, function () {
        done()
      })
      setTimeout(function () {
        send('message:update', data, function () {
          send('message:clear', null, done)
        })
      }, 3000)
    },
    success: (state, message, send, done) => {
      send('message:new', {message: message, type: 'success'}, done)
    },
    error: (state, message, send, done) => {
      send('message:new', {message: message, type: 'error'}, done)
    },
    warning: (state, message, send, done) => {
      send('message:new', {message: message, type: 'warning'}, done)
    }
  }
}
