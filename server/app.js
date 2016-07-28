const choo = require('choo')
const app = choo()

app.model({
  namespace: 'home',
  state: {
    h1: 'this is the server $state.h1 <-- hell yes'
  }
})

// define routes:
app.router((route) => [
  route('/', require('./views/home'))
])

module.exports = app


