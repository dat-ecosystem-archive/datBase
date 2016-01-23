var fs = require('fs')
var response = require('response')
var debug = require('debug')('publicbits/api')
var http = require('http')
var path = require('path')
var HttpHashRouter = require('http-hash-router')

var auth = require('./auth.js')
var createDB = require('./db')

var indexHTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'))

module.exports = function (opts, cb) {
  var router = HttpHashRouter()
  var staticPath = opts.STATIC || path.join(__dirname, '..', 'static')

  createDB(opts, function (err, db) {
    if (err) return cb(err)
    auth(db, router)

    router.set('/static/*', function (req, res, opts, cb) {
      var filepath = path.join(staticPath, opts.splat)
      var f = fs.createReadStream(filepath)
      debug('serving', filepath)
      f.pipe(response()).pipe(res)
    })

    router.set('/', function (req, res) {
      response.html(indexHTML).pipe(res)
    })

    router.set('*', function (req, res) {
      response.html(indexHTML).pipe(res)
    })

    var server = http.createServer(function (req, res) {
      console.log(req.url)
      router(req, res, {}, onerror)
      function onerror (err) {
        var msg = {error: 'Error', message: err.message}
        res.writeHead(500)
        res.end(JSON.stringify(msg))
      }
    })
    server.db = db
    cb(null, server, close)

    function close () {
      server.close()
      server.db.destroy()
    }
  })
}
