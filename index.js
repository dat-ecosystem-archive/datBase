var Server = require('./server')

var port = process.env['DAT_REGISTRY_PORT']
var datRegistryServer = Server()
datRegistryServer.listen(port)
