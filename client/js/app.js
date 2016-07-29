const choo = require('choo')
const app = choo()
// TODO: client-side choo logger

// define models:
app.model(require('./models/archive'))

// define routes:
app.router((route) => [
  route('/', require('./components/home')),
  route('/:archiveId', require('./components/archive'))
])

// start app:
const tree = app.start('#choo-refactor-main', { hash: true })

window.alert('foo!')
