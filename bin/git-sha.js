#!/usr/bin/env node
var fs = require('fs')

var file = 'REVISION' // shipit generates this file
fs.stat(file, function (err, stats) {
  var sha
  var print
  if (err) { sha = 'error' }
  if (stats && stats.isFile()) {
    sha = fs.readFileSync(file)
  } else {
    sha = 'error'
  }
  print = 'git sha: ' + sha
  fs.writeFileSync('version.txt', print, 'utf8')
  console.log('Git sha written to version.txt:\n  ' + print)
})
