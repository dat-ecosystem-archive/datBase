var Server = require('./server')

var port = process.env['DAT_REGISTRY_PORT'] || 5000
var datRegistryServer = new Server()
datRegistryServer.listen(port)
