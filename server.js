var createServer = require('./')
var fs = require('fs')

var config = JSON.parse(fs.readFileSync('./config.json').toString())

var opts = {
  GITHUB_CLIENT: config.GITHUB_CLIENT_KEY || process.env['GITHUB_CLIENT_KEY'],
  GITHUB_SECRET: config.GIHUB_SECRET_KEY || process.env['GITHUB_SECRET_KEY'],
  PORT: config.PORT || process.env['PORT'] || 5000,
}

var api = createServer(config, opts)
var port = api.options.PORT

api.server.listen(port, function() {
  console.log('listening on port', port)
})
