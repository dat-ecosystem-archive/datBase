const http = require('http')
const createRouter = require('./router')

module.exports = function (config) {
  const router = createRouter(config)

  var server = http.createServer(function (req, res) {
    router(req, res)
  })
  server.router = router

  server.on('close', function () {
    router.api.close(function () {
    })
  })

  return server
}
