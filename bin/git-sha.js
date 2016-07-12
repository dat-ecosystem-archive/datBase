#!/usr/bin/env node
var fs = require('fs')

var file = 'REVISION' // shipit generates this file, uses it for rollbacks, etc
fs.stat(file, function (err, stats) {
  var sha
  var print
  if (err) { sha = 'error' }
  if (stats && stats.isFile()) {
    sha = fs.readFileSync(file, 'utf-8')
  } else {
    sha = 'error'
  }
  print = '{ git_sha: "' + sha.toString('utf-8').split('\n')[0] + '" }'
  fs.writeFileSync('version.json', print, 'utf8')
  console.log('git sha written to version.json:\n  ' + print)
})
