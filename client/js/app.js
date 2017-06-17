const choo = require('choo')
const persist = require('choo-persist')
const app = choo()
const defaults = require('./models/defaults')
const css = require('sheetify')

// define models:
app.use(persist())
app.use(logger)
app.use(require('./defaults')(defaults))
app.use(require('./models/archive'))
app.use(require('./models/township'))
app.use(require('./models/explore'))
app.use(require('./models/profile'))
app.use(require('./models/message'))
app.use(require('./models/preview'))

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    console.log('event', messageName, data)
  })
}

css('dat-colors')

// define routes:
app.route('/install', require('./pages/install'))
app.route('/publish', require('./pages/publish'))
app.route('/explore', require('./pages/explore'))
app.route('/register', require('./pages/auth/register'))
app.route('/login', require('./pages/auth/login'))
app.route('/reset-password', require('./pages/auth/reset-password'))
app.route('/404', require('./pages/fourohfour'))
app.route('/team', require('./pages/landing/team'))
app.route('/about', require('./pages/landing/about'))
app.route('/view', require('./pages/archive'))
app.route('/download/:archiveKey', require('./pages/download'))
app.route('/dat/:archiveKey', require('./pages/archive'))
app.route('/dat://:archiveKey', require('./pages/archive'))
app.route('/profile/edit', require('./pages/auth/edit-profile'))
app.route('/profile/delete', require('./pages/auth/delete-account'))
app.route('/dat://:archiveKey/contents', require('./pages/archive'))
app.route('/dat://:archiveKey/contents/*', require('./pages/archive'))
app.route('/:username/:dataset', require('./pages/archive'))
app.route('/:username/:dataset/*', require('./pages/archive'))
app.route('/:username', require('./pages/auth/profile'))
app.route('/', require('./pages/landing/splash'))

app.defaults = defaults

if (module.parent) {
  module.exports = app
} else {
  app.mount('#app-root')
}
