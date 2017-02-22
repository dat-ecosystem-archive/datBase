var api = require('dat-registry')

var defaultState = {
  data: null,
  limit: 10,
  offset: 0
}

module.exports = {
  namespace: 'list',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.list,
  reducers: {
    update: (data, state) => {
      return data
    }
  },
  effects: {
    nextPage: function (data, state, send, done) {
      var newOffset = state.offset + state.limit
      var client = api()
      client.dats.get({offset: newOffset, limit: state.limit}, function (err, resp, json) {
        if (err) throw err
        send('list:update', {offset: newOffset, data: json})
        done()
      })
    }
  }
}
