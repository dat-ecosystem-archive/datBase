const http = require('http')
const createRouter = require('./router')

module.exports = function (config, db) {
  var log = config.log
  if (!config.archiver) throw new Error('config.archiver directory required')
  const router = createRouter(config)

  return http.createServer(function (req, res) {
    var time = Date.now()
    if (log) log.info({message: 'request', method: req.method, url: req.url})
    res.on('finish', end)
    res.on('close', end)
    router(req, res)

    function end () {
      res.removeListener('close', end)
      res.removeListener('finish', end)
      if (log) {
        log.info({
          message: 'response',
          finished: res.finished,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          requestTime: Date.now() - time
        })
      }
    }
  })
}
