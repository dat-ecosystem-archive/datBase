const mount = require('choo/mount')
const choo = require('choo')
const app = choo()
const css = require('sheetify')
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

css('dat-colors')

// define routes:
app.router({default: '/404'}, [
  ['/install', require('./pages/create')],
  ['/browser', require('./pages/create/browser')],
  ['/list', require('./pages/list')],
  ['/register', require('./pages/auth/register')],
  ['/login', require('./pages/auth/login')],
  ['/reset-password', require('./pages/auth/reset-password')],
  ['/download/:archiveKey', require('./pages/download')],
  ['/~:username/:dataset', require('./pages/archive')],
  ['/404', require('./pages/fourohfour')],
  ['/blog', require('./pages/landing/blog')],
  ['/blog/:name', require('./pages/landing/post')],
  ['/team', require('./pages/landing/team')],
  ['/about', require('./pages/landing/about')],
  ['/:archiveKey', require('./pages/archive')],
  ['/:archiveKey/:filename', require('./pages/archive')],
  ['/', require('./pages/landing/splash')]
])

if (module.parent) {
  module.exports = app
} else {
  mount('#app-root', app.start())
}
