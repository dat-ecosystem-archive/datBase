const choo = require('choo')
const app = choo()
// TODO: server-side choo logger

// define models:
app.model(require('./models/archive'))

// define routes:
app.router((route) => [
  route('/', require('./pages/home')),
  route('/:archiveId', require('./pages/archive'))
])

module.exports = app


