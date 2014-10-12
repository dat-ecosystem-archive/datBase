var Server = require('./api/server')
var config = require('./config')

var port = config['DAT_REGISTRY_PORT']
var datRegistryServer = new Server()
datRegistryServer.listen(port)
