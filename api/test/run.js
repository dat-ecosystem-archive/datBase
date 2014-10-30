var tape = require('tape')
var path = require('path')
var common = require('./common.js')()

function test(name, testFunction) {
  return tape(common.testPrefix + name, testFunction)
}

var testFiles = [
  'authTests.js',
  'metadatTests.js'
]

var tests = []
for (i in testFiles) {
  tests.push(require(path.join(__dirname, 'tests', testFiles[i])))
}

// var finish = require(path.join(__dirname, 'tests', 'finish.js'))

var specificTestFile = process.argv[2]
var specificTest = process.argv[3]

if (specificTestFile) {
  var testModule = require(path.join(__dirname, specificTestFile))
  if (specificTest) testModule[specificTest](test, common)
  else testModule.all(test, common)
} else {
  runAll()
}

function runAll() {
  tests.map(function(t) {
    t.all(test, common)
  })
}