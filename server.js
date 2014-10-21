var createServer = require('./')

var opts = {
  GITHUB_CLIENT: process.env['DAT_REGISTRY_GITHUB_CLIENT'],
  GITHUB_SECRET: process.env['DAT_REGISTRY_GITHUB_SECRET'],
  PORT: process.env['PORT'] || 5000
}

var api = createServer(opts)
var port = api.options.PORT

api.server.listen(port, function() {
  console.log('listening on port', port)
})
