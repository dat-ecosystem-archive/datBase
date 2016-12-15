const choo = require('choo')
const app = choo()
// Enable webrtc debugging:
// try { localStorage.debug = 'webrtc-swarm' } catch (e) {}

// define models:
app.model(require('./models/archive'))
app.model(require('./models/import-queue'))
app.model(require('./models/user'))
app.model(require('./models/help'))
app.model(require('./models/preview'))

// define routes:
app.router((route) => [
  route('/', require('./pages/landing')),
  route('/view/:archiveKey', require('./pages/archive')),
  route('/:username/:dataset', require('./pages/archive'))
])

if (module.parent) {
  module.exports = app
} else {
  app.start('#app-root', {href: false})
}
