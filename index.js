var st = require("st")
var extend = require('extend')

var Server = require('./api/server.js')
var config = require('./config.js')

module.exports = function(overrides) {
  var opts = extend({}, config, overrides)
  var port = config['PORT']
  var api = new Server(opts)

  api.router.addRoute("/static/*", st({
    path: __dirname + "/static",
    url: "/static"
  }))
  
  return api
}
