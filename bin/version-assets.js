#!/usr/bin/env node

var Version = require('node-version-assets')

var versionAssets = new Version({
  assets: [
    'public/js/app.js',
    'public/css/main.css'
  ],
  grepFiles: [
    'index.html'
  ],
  keepOriginal: true,
  keepOldVersions: false
})

versionAssets.run()
