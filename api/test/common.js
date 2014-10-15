var path = require('path')
var debug = require('debug')('dat.test-common')

var st = require("st")

var Server = require('../../api/server.js')
var models = require('../../api/models.js')
var config = require('../../config.js')

var port = config['DAT_REGISTRY_PORT']

module.exports = function() {
  var common = {}

  common.getRegistry = function (t, cb) {
    var server = new Server()
    var router = server.createRoutes()
    server.listen(router, port)
    cb('win', models)
  }

  return common
}

