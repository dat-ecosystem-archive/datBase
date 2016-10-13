var defaultState = {
  username: null
}

var noop = function () {}

function externalLoginCall ({username}, cb) {
  cb(null, {success: true})
}

module.exports = {
  namespace: 'user',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
  reducers: {
    logout: (data, state) => {
      return { username: null }
    },
    update: (data, state) => {
      return {
        username: data.username || state.username
      }
    }
  },
  effects: {
    login: (data, state, send, done) => {
      send('user:update', {logging_in: true}, noop)
      externalLoginCall(data, (err) => {
        if (err) {
          send('user:update', {logging_in: false, error: err}, done)
        } else {
          send('user:update', {logging_in: false, username: data.username}, done)
        }
      })
    }
  }
}
