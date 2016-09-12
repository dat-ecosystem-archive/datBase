'use strict'

const fs = require('fs')
const assert = require('assert')
const serializeJS = require('serialize-javascript')
const collect = require('collect-stream')
const encoding = require('dat-encoding')
const TimeoutStream = require('through-timeout')
const UrlParams = require('uparams')
const getMetadata = require('../utils/metadata')
const router = require('server-router')()

const app = require('../client/js/app').app
const page = require('./page')
const Haus = require('./haus')

var haus = Haus()

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
      console.warn('error: ' + e.message)
      return sendSPA('/:archiveKey', req, res, params, state)
    }
    var archive = haus.getArchive(key)
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
      getMetadata(archive, function (err, metadata) {
        if (err) state.archive.error = {message: err.message}
        state.archive.entries = data
        state.archive.metadata
        sendSPA('/:archiveKey', req, res, params, state, metadata)
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

function sendSPA (route, req, res, params, state, metadata) {
  const frozenState = Object.freeze(state)
  const contents = app.toString(route, frozenState)
  const urlParams = new UrlParams(req.url)
  res.setHeader('Content-Type', 'text/html')
  if (urlParams.debug) {
    return fs.access('./server/page-debug.js', function (err) {
      if (err) {
        return res.end('Please run the bin/version-assets script via `npm run version` to debug with un-minified assets.')
      }
      return res.end(require('./page-debug')(contents, serializeJS(frozenState)))
    })
  }
  if (!metadata) metadata = {}
  metadata.route = route
  return res.end(page(contents, metadata, serializeJS(frozenState)))
}

module.exports = router
