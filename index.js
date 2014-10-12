var st = require("st")

var Server = require('./api/server.js')
var config = require('./config.js')

var port = config['DAT_REGISTRY_PORT']
var server = new Server()

var router = server.createRoutes()

router.addRoute("/static/*", st({
    path: __dirname + "/static",
    url: "/static"
}))

server.listen(router, port)
