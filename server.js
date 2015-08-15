var createServer = require('./')
var fs = require('fs')

var config = JSON.parse(fs.readFileSync('./config.json').toString())

var opts = {
  GITHUB_CLIENT: config.GITHUB_CLIENT || process.env['GITHUB_CLIENT'],
  GITHUB_SECRET: config.GIHUB_SECRET || process.env['GITHUB_SECRET'],
  PORT: config.PORT || process.env['PORT'] || 5000,
  admins: config.admins
}

var api = createServer(opts)
var port = api.options.PORT

api.server.listen(port, function() {
  console.log('listening on port', port)
})
