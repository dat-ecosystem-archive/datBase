var tape = require('tape')
var common = require('./common.js')()

function test(name, testFunction) {
  return tape(common.testPrefix + name, testFunction)
}

var tests = [
  require('./tests/auth.js'),
]

var finish = require('./tests/finish.js')


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
