const fs = require('fs')
const serverRouter = require('server-router')
const app = require('./app')
const router = serverRouter()

router.on('/', {
  get: function (req, res, params) {
    const contents = app.toString('/', app.state)
    // TODO: send client app state down the pipe to client
    res.setHeader('Content-Type', 'text/html');
    res.end(contents)
  }
})

// serve old pre-choo client-side-only app for migration work:
router.on('/migrate', {
  get: function (req, res, params) {
    fs.readFile('./public/html/index.html', 'utf-8', function (err, contents) {
      if (err) return res.end('nope')
      res.setHeader('Content-Type', 'text/html')
      res.end(contents)
    })
  }
})

// new choo-based archive route:
router.on('/:archiveId', {
  get: function (req, res, params) {
    const contents = app.toString('/:archiveId', app.state)
    // TODO: send client app state down the pipe to client
    res.setHeader('Content-Type', 'text/html');
    res.end(contents)
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

// TODO: decide on a real static asset setup with cacheing strategy
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

// TODO: decide on a real static asset setup with cacheing strategy
router.on('/public/img/:asset', {
  get: function (req, res, params) {
    console.log('GET ' + req.url)
    fs.readFile('.' + req.url, 'utf-8', function (err, contents) {
      if (err) return res.end('nope')
      res.setHeader('Content-Type', 'image/svg+xml')
      res.end(contents)
    })
  }
})

module.exports = router
