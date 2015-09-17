var args = require('minimist')(process.argv.slice(2))
var createServer = require('./')
var fs = require('fs')
var getport = require('getport')

var config = JSON.parse(fs.readFileSync('./config.json').toString())

if (args.port) config.PORT = args.port

var api = createServer(config)
getport(5000, function (err, port) {
  var port = api.options.PORT || port

  api.server.listen(port, function (err) {
    console.log('listening on port', port)
  })

})
