'use strict'

const fs = require('fs')
// TODO: determine client-side or server-side choo logger
const app = require('../client/js/app')
const page = require('./page')
const router = require('server-router')()

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

// landing page
router.on('/', {
  get: function (req, res, params) {
    // TODO: get global default state with route params applied
    let state = copyAppState({archive: require('../client/js/models/archive').state})
    const contents = app.toString('/', state)
    // TODO: send client app state down the pipe to client
    res.setHeader('Content-Type', 'text/html')
    res.end(page(contents))
  }
})

// new choo-based archive route:
router.on('/:archiveKey', {
  get: function (req, res, params) {
    // TODO: get global default state with route params applied
    let state = copyAppState({archive: require('../client/js/models/archive').state})
    state.archive.key = params.archiveKey
    const contents = app.toString('/:archiveKey', state)
    // TODO: send client app state down the pipe to client
    res.setHeader('Content-Type', 'text/html')
    res.end(page(contents))
  }
})

// TODO: better recursion for nested filepaths on archives
router.on('/:archiveKey/:filePath', {
  get: function (req, res, params) {
    res.end('route is: /' + params.archiveKey + '/' + params.filePath)
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

function copyAppState (state) {
  return JSON.parse(JSON.stringify(state))
}

module.exports = router
