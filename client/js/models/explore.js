var api = require('../api')()
var xtend = require('xtend')

var defaultState = {
  data: [],
  limit: 10,
  offset: 0
}

module.exports = {
  namespace: 'list',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.list,
  reducers: {
    update: (state, data) => {
      return xtend(state, data)
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
