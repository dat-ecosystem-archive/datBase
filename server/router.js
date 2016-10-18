'use strict'

const fs = require('fs')
const assert = require('assert')
const collect = require('collect-stream')
const encoding = require('dat-encoding')
const TimeoutStream = require('through-timeout')
const UrlParams = require('uparams')
const getMetadata = require('../client/js/utils/metadata')
const router = require('server-router')()

const app = require('../client/js/app')
const page = require('./page')
const Dat = require('./haus')

var dat = Dat()

// landing page
router.on('/', {
  get: function (req, res, params) {
    var state = getDefaultAppState()
    sendSPA('/', req, res, params, state)
  }
})

// new choo-based archive route:
router.on('/:archiveKey', {
  get: function (req, res, params) {
    var state = getDefaultAppState()
    var key
    try {
      key = encoding.decode(params.archiveKey)
    } catch (e) {
      state.archive.error = {message: e.message}
      console.warn('router.js /:archiveKey route error: ' + e.message)
      return sendSPA('/:archiveKey', req, res, params, state)
    }
    var archive = dat.get(key)
    state.archive.key = params.archiveKey
    var listStream = archive.list({live: false})
    var cancelled = false
    var timeout = TimeoutStream({
      objectMode: true,
      duration: 3000
    }, () => {
      cancelled = true
      console.log('server getArchive() timed out for key: ' + params.archiveKey)
      sendSPA('/:archiveKey', req, res, params, state)
    })

    collect(listStream.pipe(timeout), function (err, data) {
      if (cancelled) return
      if (err) state.archive.error = {message: err.message}
      state.archive.entries = data
      getMetadata(archive, function (err, metadata) {
        if (err) state.archive.error = {message: 'no metadata'}
        if (metadata) {
          state.archive.metadata = metadata
        }
        dat.close(archive)
        sendSPA('/:archiveKey', req, res, params, state)
      })
    })
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

/* helpers */
function getDefaultAppState () {
  var state = {}
  app._store._models.forEach((model) => {
    assert.equal(typeof model, 'object', 'getDefaultAppState: model must be an object')
    assert.equal(typeof model.namespace, 'string', 'getDefaultAppState: model must have a namespace property that is a string')
    assert.equal(typeof model.state, 'object', 'getDefaultAppState: model must have a state property that is an object')
    state[model.namespace] = model.state
  })
  return JSON.parse(JSON.stringify(state))
}

function sendSPA (route, req, res, params, state) {
  const frozenState = Object.freeze(state)
  const contents = app.toString(route, frozenState)
  const urlParams = new UrlParams(req.url)
  res.setHeader('Content-Type', 'text/html')
  var url = req.headers.host + req.url
  if (urlParams.debug) {
    return fs.access('./server/page-debug.js', function (err) {
      if (err) {
        return res.end('Please run the bin/version-assets script via `npm run version` to debug with un-minified assets.')
      }
      return res.end(require('./page-debug')(url, contents, frozenState))
    })
  }
  return res.end(page(url, contents, frozenState))
}

module.exports = router
