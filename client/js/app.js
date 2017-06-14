const mount = require('choo/mount')
const choo = require('choo')
const app = choo()
const css = require('sheetify')
// Enable webrtc debugging:
// try { localStorage.debug = 'webrtc-swarm' } catch (e) {}

// define models:
app.model(require('./models/archive'))
app.model(require('./models/township'))
app.model(require('./models/explore'))
app.model(require('./models/profile'))
app.model(require('./models/message'))
app.model(require('./models/preview'))

css('dat-colors')

// define routes:
app.router({default: '/404'}, [
  ['/install', require('./pages/create')],
  ['/explore', require('./pages/explore')],
  ['/register', require('./pages/auth/register')],
  ['/login', require('./pages/auth/login')],
  ['/reset-password', require('./pages/auth/reset-password')],
  ['/download/:archiveKey', require('./pages/download')],
  ['/dat/:archiveKey', require('./pages/archive')],
  ['/view/:archiveKey', require('./pages/archive')],
  ['/view', require('./pages/archive')],
  ['/profile/:username', require('./pages/auth/profile')],
  ['/profile/edit', require('./pages/auth/edit-profile')],
  ['/profile/delete', require('./pages/auth/delete-account')],
  ['/404', require('./pages/fourohfour')],
  ['/team', require('./pages/landing/team')],
  ['/about', require('./pages/landing/about')],
  ['/:archiveKey/contents', require('./pages/archive')],
  ['/:archiveKey/contents/*', require('./pages/archive')],
  ['/:username/:dataset', require('./pages/archive')],
  ['/:username/:dataset/*', require('./pages/archive')],
  ['/:archiveKey', require('./pages/archive')],
  ['/', require('./pages/landing/splash')]
])

if (module.parent) {
  module.exports = app
} else {
  mount('#app-root', app.start())
}
