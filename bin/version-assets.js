var Version = require('node-version-assets');

var versionAssets = new Version({
  assets: [
    'public/js/app.js',
    'public/css/main.css',
  ],
  grepFiles: [
    'index.html'
  ]
});

versionAssets.run();
