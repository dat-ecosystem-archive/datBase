var Server = require('./server')
var config = require('./config')

var port = config['DAT_REGISTRY_PORT']
console.log(config)
var datRegistryServer = new Server()
datRegistryServer.listen(port)
