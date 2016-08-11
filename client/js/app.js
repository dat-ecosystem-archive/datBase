const choo = require('choo')
const app = choo()

// define models:
app.model(require('./models/archive'))
app.model(require('./models/user'))
app.model(require('./models/help'))

// define routes:
app.router((route) => [
  route('/', require('./pages/landing')),
  route('/:archiveKey', require('./pages/archive'))
])

if (module.parent) {
  module.exports = {
    app: app,
    getServerComponent: (component) => {
      let components = {
        // register server-side components here:
        hyperdrive: require('./components/hyperdrive')
      }
      if (components[component]) {
        return components[component]
      } else {
        console.log(`\nWARNING: app.js could not find server component ${component} \n`)
      }
    }
  }
} else {
  app.model(require('./models/app-rehydrator'))
  app.start('#app-root')
}
