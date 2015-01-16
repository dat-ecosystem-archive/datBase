var createServer = require('./')

var opts = {
  GITHUB_CLIENT: process.env['DAT_REGISTRY_GITHUB_CLIENT'],
  GITHUB_SECRET: process.env['DAT_REGISTRY_GITHUB_SECRET'],
  PORT: process.env['PORT'] || 5000
}

createServer(opts, function(err, api) {
  if (err) throw err
  
  var port = api.options.PORT

  api.server.listen(port, function() {
    console.log('listening on port', port)
  })
  
})
