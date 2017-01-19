const choo = require('choo')
const app = choo()
// Enable webrtc debugging:
// try { localStorage.debug = 'webrtc-swarm' } catch (e) {}

// define models:
app.model(require('./models/read-only-archive'))
app.model(require('./models/import-queue'))
app.model(require('./models/user'))
app.model(require('./models/list'))
app.model(require('./models/error'))
app.model(require('./models/message'))
app.model(require('./models/help'))
app.model(require('./models/preview'))

// define routes:
app.router((route) => [
  route('/create', require('./pages/create')),
  route('/browser', require('./pages/create/browser')),
  route('/list', require('./pages/list')),
  route('/register', require('./pages/auth/register')),
  route('/login', require('./pages/auth/login')),
  route('/view/:archiveKey', require('./pages/archive')),
  route('/:username/:dataset', require('./pages/archive')),
  route('/404', require('./pages/fourohfour'))
])

if (module.parent) {
  module.exports = app
} else {
  app.start('#app-root', {href: false})
}
