const choo = require('choo')
const app = choo()
// TODO: server-side choo logger

app.router((route) => [
  route('/', require('./pages/home')),
  route('/:archiveId', require('./pages/archive'))
])

module.exports = app
