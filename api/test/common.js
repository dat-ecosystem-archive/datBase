var path = require('path')
var debug = require('debug')('dat.test-common')
var st = require("st")

var Server = require('../../api')

module.exports = function() {
  var common = {}

  common.getRegistry = function (t, cb) {
    
    var api = Server()
    var port = api.options.PORT

    api.server.listen(port, function() {
      console.log('listening on port', port)
      cb(null, api, done)
    })
    
    function done() {
      api.server.close()
    }

  }

  return common
}

