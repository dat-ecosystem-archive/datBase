var fs = require('fs')
var response = require('response')
var debug = require('debug')('publicbits/api')
var http = require('http')
var path = require('path')
var HttpHashRouter = require('http-hash-router')
var auth = require('./auth.js')
var db = require('./db.js')

var indexHTML = fs.readFileSync('./index.html')

module.exports = function (opts) {
  var router = HttpHashRouter()
  var staticPath = opts.STATIC || path.join(__dirname, '..', 'static')

  server.db = db(opts.db)
  auth(server.db, router)

  router.set('/static/*', function (req, res, opts, cb) {
    var filepath = path.join(staticPath, opts.splat)
    var f = fs.createReadStream(filepath)
    debug('serving', filepath)
    f.pipe(response()).pipe(res)
  })

  router.set('/', function (req, res) {
    response.html(indexHTML).pipe(res)
  })

  var server = http.createServer(function (req, res) {
    router(req, res, {}, onerror)
    function onerror (err) {
      var msg = {error: 'Error', message: err.message}
      response.json(msg, 500).pipe(res)
    }
  })

  return server
}
