const http = require('http')
const Dat = require('./haus')
const createRouter = require('./router')

module.exports = function (config, db, opts) {
  if (!opts) opts = {}
  if (!config.cachedb) throw new Error('config.cachedb required')
  const dat = Dat(config)
  const router = createRouter(config, db, dat)

  return http.createServer(function (req, res) {
    var time = Date.now()
    if (opts.log) opts.log.info({message: 'request', method: req.method, url: req.url})
    res.on('finish', end)
    res.on('close', end)
    router(req, res)

    function end () {
      res.removeListener('close', end)
      res.removeListener('finish', end)
      if (opts.log) {
        opts.log.info({
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
