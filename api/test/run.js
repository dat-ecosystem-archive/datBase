var tape = require('tape')
var common = require('./common.js')()

function test(name, testFunction) {
  return tape(common.testPrefix + name, testFunction)
}

var tests = [
  require('./tests/authTests.js'),
]


var specificTestFile = process.argv[2]
var specificTest = process.argv[3]

if (specificTestFile) {
  var testModule = require('./' + path.relative(__dirname, specificTestFile))
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
