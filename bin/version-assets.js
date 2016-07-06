#!/usr/bin/env node
var fs = require('fs')
var Version = require('node-version-assets')

// productionize `index.html` by updating asset references
// `main.css` -> 'main.min.css'
// `app.js` -> `app.min.js`
// copy original, un-updated `index.html` to `debug.html`
var index = fs.readFileSync('index.html', 'utf8')
fs.renameSync('index.html', 'debug.html')
var prod = index
             .replace(/public\/css\/main.css/gmi, 'public/css/main.min.css')
             .replace(/public\/js\/app.js/gmi, 'public/css/app.min.js')
fs.writeFileSync('index.html', prod, 'utf8')

// version `app.min.js` and `main.min.js` by appending md5 hash to filename
// & update references to files in `index.html`
var versionInstance = new Version({
  assets: [
    'public/js/app.min.js',
    'public/css/main.min.css'
  ],
  grepFiles: [
    'index.html'
  ],
  keepOriginal: true,
  keepOldVersions: false
})

versionInstance.run()
