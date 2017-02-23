var api = require('../api')()

var defaultState = {
  data: null,
  limit: 10,
  offset: 0
}

module.exports = {
  namespace: 'list',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.list,
  reducers: {
    update: (state, data) => {
      return data
    }
  },
  effects: {
    nextPage: function (state, data, send, done) {
      var newOffset = state.offset + state.limit
      api.dats.get({offset: newOffset, limit: state.limit}, function (err, resp, json) {
        if (err) throw err
        send('list:update', {offset: newOffset, data: json})
        done()
      })
    }
  }
}
