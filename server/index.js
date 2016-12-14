const http = require('http')
const database = require('./database')
const createRouter = require('./router')
const bole = require('bole')

bole.output({
  level: 'info',
  stream: process.stdout
})

const log = bole(__filename)

const PORT = process.env.PORT || process.env.DATLAND_PORT || 8080
const config = require('../config')
const db = database(config.db)
const router = createRouter(config, db)

const server = http.createServer(function (req, res) {
  var time = Date.now()
  log.info({message: 'request', method: req.method, url: req.url})
  res.on('finish', end)
  res.on('close', end)
  router(req, res)

  function end () {
    res.removeListener('close', end)
    res.removeListener('finish', end)
    log.info({
      message: 'response',
      finished: res.finished,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      requestTime: Date.now() - time
    })
  }
})

server.listen(PORT, function () {
  log.info({
    message: 'listening',
    port: server.address().port,
    env: process.env.NODE || 'undefined'
  })
})

process.once('uncaughtException', function (err) {
  log.error({message: 'error', error: err.message, stack: err.stack})
  console.error(err.stack)
  process.exit(1)
})
