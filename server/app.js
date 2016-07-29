const choo = require('choo')
const app = choo()
// TODO: server-side choo logger

// define models
app.model(require('./models/home-page'))

// define routes:
app.router((route) => [
  route('/', require('./components/home'))
])

module.exports = app

