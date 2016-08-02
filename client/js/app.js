const choo = require('choo')
const app = choo()
// TODO: client-side choo logger

// define models:
app.model(require('./models/archive'))

// define routes:
app.router((route) => [
  route('/:archiveId', require('./components/archive'))
])

// start app:
app.start('#archive-list')
