var createServer = require('./')
var fs = require('fs')
var getport = require('getport')

var config = JSON.parse(fs.readFileSync('./config.json').toString())

var opts = {
  GITHUB_CLIENT: config.GITHUB_CLIENT || process.env['GITHUB_CLIENT'],
  GITHUB_SECRET: config.GIHUB_SECRET || process.env['GITHUB_SECRET'],
  PORT: config.PORT || process.env['PORT'],
  CREATE_DAT: config.CREATE_DAT || process.env['CREATE_DAT']
}

var api = createServer(opts)
getport(5000, function (err, port) {
  var port = api.options.PORT || port

  api.server.listen(port, function (err) {
    console.log('listening on port', port)
  })

})