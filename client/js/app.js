const choo = require('choo')
const app = choo()

// define models:
app.model(require('./models/archive'))
app.model(require('./models/user'))

// define routes:
app.router((route) => [
  route('/', require('./pages/landing')),
  route('/:archiveKey', require('./pages/archive'))
])

if (module.parent) {
  module.exports = app
} else {
  app.model(require('./models/app-rehydrator'))
  app.start('#app-root')
}
