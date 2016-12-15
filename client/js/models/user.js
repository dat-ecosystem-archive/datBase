var township = require('township-client')
var defaultState = {
  username: null
}

function getClient () {
  return township({
    url: '',
    routes: {
      register: '/auth/v1/register',
      login: '/auth/v1/login'
    }
  })
}

module.exports = {
  namespace: 'user',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
  reducers: {
    update: (data, state) => {
      return {
        username: data.username || state.username
      }
    }
  },
  effects: {
    login: (data, state, send, done) => {
      const client = getClient()
      client.login(data, function (err, data) {
        if (err) console.error(err)
      })
    },
    register: (data, state, send, done) => {
      const client = getClient()
      client.register(data, function (err, data) {
        if (err) console.error(err)
      })
    }
  }
}
