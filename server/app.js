const choo = require('choo')
const app = choo()
// TODO: server-side choo logger

app.model({
  namespace: 'home',
  state: {
    h1: 'this is the server $state.h1'
  }
})

// define routes:
app.router((route) => [
  route('/', require('./components/home'))
])

module.exports = app


