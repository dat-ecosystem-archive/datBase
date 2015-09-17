var args = require('minimist')(process.argv.slice(2))
var createServer = require('./')
var fs = require('fs')
var getport = require('getport')

var opts = {}
if (args.port) opts.PORT = args.port

var api = createServer(opts)
getport(5000, function (err, port) {
  var port = api.options.PORT || port

  api.server.listen(port, function (err) {
    console.log('listening on port', port)
  })

})
