const choo = require('choo')
const app = choo()
// Enable webrtc debugging:
// try { localStorage.debug = 'webrtc-swarm' } catch (e) {}

// define models:
app.model(require('./models/read-only-archive'))
app.model(require('./models/user'))
app.model(require('./models/list'))
app.model(require('./models/error'))
app.model(require('./models/message'))
app.model(require('./models/help'))
app.model(require('./models/preview'))

// define routes:
app.router({default: '/404'}, [
  ['/install', require('./pages/create')],
  ['/browser', require('./pages/create/browser')],
  ['/list', require('./pages/list')],
  ['/register', require('./pages/auth/register')],
  ['/login', require('./pages/auth/login')],
  ['/reset-password', require('./pages/auth/reset-password')],
  ['/download/:archiveKey', require('./pages/download')],
  ['/dat/:archiveKey', require('./pages/archive')],
  ['/view/:archiveKey', require('./pages/archive')],
  ['/:username/:dataset', require('./pages/archive')],
  ['/404', require('./pages/fourohfour')]
])

if (module.parent) {
  module.exports = app
} else {
  app.start('#app-root', {href: false})
}
