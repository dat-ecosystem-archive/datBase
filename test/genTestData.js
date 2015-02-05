var tape = require('tape')
var path = require('path')
var common = require('./common.js')({
  debug: true
})

function test(name, testFunction) {
  return tape(common.testPrefix + name, testFunction)
}

var testFiles = [
  'metadatTests.js'
]

var tests = []
for (i in testFiles) {
  tests.push(require(path.join(__dirname, 'tests', testFiles[i])))
}

// var finish = require(path.join(__dirname, 'tests', 'finish.js'))

tests.map(function(t) {
  t.all(test, common)
})
