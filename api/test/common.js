var path = require('path')
var debug = require('debug')('dat.test-common')
var request = require('request').defaults({json: true})

module.exports = function() {
  var common = {}

  common.apiTest = function getDat(t,  cb) {
    cb()
    t.end()
  }
  return common
}

