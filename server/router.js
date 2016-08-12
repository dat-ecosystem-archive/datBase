'use strict'

const fs = require('fs')
const assert = require('assert')
const serializeJS = require('serialize-javascript')
const encoding = require('dat-encoding')
const app = require('../client/js/app').app
const page = require('./page')
const router = require('server-router')()
const Haus = require('./haus')

let haus = Haus()

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
    let state = getDefaultAppState()
    sendSPA('/', res, state)
  }
})

// new choo-based archive route:
router.on('/:archiveKey', {
  get: function (req, res, params) {
    let state = getDefaultAppState()
    let key
    try {
      key = encoding.decode(params.archiveKey)
    } catch (e) {
      state.archive.error = {message: e.message}
      return sendSPA('/:archiveKey', res, state)
    }
    let archive = haus.getArchive(key)
    archive.list(function (err, data) {
      if (err) state.archive.error = {message: err.message}
      state.archive.entries = data
      state.archive.key = params.archiveKey
      sendSPA('/:archiveKey', res, state)
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
  let state = {}
  app._store._models.forEach((model) => {
    assert.equal(typeof model, 'object', 'getDefaultAppState: model must be an object')
    assert.equal(typeof model.namespace, 'string', 'getDefaultAppState: model must have a namespace property that is a string')
    assert.equal(typeof model.state, 'object', 'getDefaultAppState: model must have a state property that is an object')
    state[model.namespace] = model.state
  })
  return state
}

function sendSPA (route, res, state) {
  const frozenState = Object.freeze(state)
  const contents = app.toString('/', frozenState)
  res.setHeader('Content-Type', 'text/html')
  res.end(page(contents, serializeJS(frozenState)))
}

module.exports = router
