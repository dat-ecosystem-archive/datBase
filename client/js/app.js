const choo = require('choo')
const app = choo()
// Enable webrtc debugging:
// try { localStorage.debug = 'webrtc-swarm' } catch (e) {}

// define models:
app.model(require('./models/archive'))
app.model(require('./models/user'))
app.model(require('./models/help'))
app.model(require('./models/preview'))

// define routes:
app.router((route) => [
  route('/', require('./pages/landing')),
  route('/:archiveKey', require('./pages/archive'))
])

if (module.parent) {
  module.exports = {
    app: app,
    getServerComponent: (component) => {
      var components = {
        // register server-side components here:
        hyperdrive: require('../../server/components/hyperdrive')
      }
      if (components[component]) {
        return components[component]
      } else {
        console.log(`\nWARNING: app.js could not find server component ${component} \n`)
      }
    }
  }
} else {
  app.start('#app-root')
}
