const qs = require('querystring')
const http = require('choo/http')

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
      var params = qs.stringify({offset: newOffset, limit: state.limit})
      http.get('/dats?' + params, {json: true}, function (err, resp, json) {
        if (err) throw err
        console.log(resp, json)
        send('list:update', {offset: newOffset, data: json})
        done()
      })
    }
  }
}
