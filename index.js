var st = require("st")

var Server = require('./api')

module.exports = function(overrides) {
  var api = new Server(overrides)

  api.router.addRoute("/static/*", st({
    path: __dirname + "/static",
    url: "/static"
  }))

  return api
}
