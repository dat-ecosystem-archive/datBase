var args = require('minimist')(process.argv.slice(2))
var createServer = require('./')
var fs = require('fs')
var getport = require('getport')
var defaults = require('./api/defaults.js')
var config = JSON.parse(fs.readFileSync('./config.json').toString())

for (var key in defaults) {
  var val = process.env[key]
  if (val) config[key] = val
}

if (args.port) config.PORT = args.port

var api = createServer(config)
getport(5000, function (err, port) {
  var port = api.options.PORT || port

  api.server.listen(port, function (err) {
    console.log('listening on port', port)
  })

})
