#!/usr/bin/env node
var fs = require('fs')
var sha = require('git-sha')

sha(function (err, gitSha) {
  var print
  if (err) print = 'git sha: error'
  if (!err) print = 'git sha: ' + gitSha
  fs.writeFileSync('version.txt', print, 'utf8')
  console.log('Git sha written to version.txt:\n  ' + print)
})
