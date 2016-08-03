const choo = require('choo')
const app = choo()

// define models:
app.model(require('./models/archive'))

// define routes:
app.router((route) => [
  route('/', require('./pages/home')),
  route('/:archiveKey', require('./pages/archive'))
])

if (module.parent) {
  module.exports = app
} else {
  app.start('#app-root')
}
