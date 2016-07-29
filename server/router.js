const fs = require('fs')
const serverRouter = require('server-router')
const app = require('./app')
const router = serverRouter()

router.on('/', {
  get: function (req, res, params) {
    res.setHeader('Content-Type', 'text/html');
    const body = app.toString('/', app.state)
    // TODO: send app state down the pipe?
    res.end('<html><body>' + body + '</body></html>')
  }
})

router.on('/:archiveId', {
  get: function (req, res, params) {
    res.setHeader('Content-Type', 'text/html');
    res.end('route is: /:archiveId' + params.archiveId)
  }
})

// TODO: better recursion for nested filepaths on archives
router.on('/:archiveId/:filePath', {
  get: function (req, res, params) {
    res.end('route is: /' + params.archiveId + '/' + params.filePath)
  }
})

// TODO: decide on a real static asset setup with cacheing strategy
router.on('/public/css/:asset', {
  get: function (req, res, params) {
    console.log('GET ' + req.url)
    fs.readFile('.' + req.url, 'utf-8', function (err, contents) {
      if (err) return res.end('nope')
      res.setHeader('Content-Type', 'text/css')
      res.end(contents)
    })
  }
})

router.on('/public/js/:asset', {
  get: function (req, res, params) {
    console.log('GET ' + req.url)
    fs.readFile('.' + req.url, 'utf-8', function (err, contents) {
      if (err) return res.end('nope')
      res.setHeader('Content-Type', 'text/javascript')
      res.end(contents)
    })
  }
})

module.exports = router
