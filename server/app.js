const choo = require('choo')
const app = choo()

// define models:
// app.model(require('./models/archive'))

// define routes:
app.router((route) => [
  route('/', require('./views/home')),
  // route('/:archiveId', require('./views/main'))
])

// start app:
app.start()

module.exports = app


