'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const collect = require('collect-stream')
const encoding = require('dat-encoding')
const TimeoutStream = require('through-timeout')
const UrlParams = require('uparams')
const bole = require('bole')
const getMetadata = require('../client/js/utils/metadata')
const router = require('server-router')()
const township = require('township')
const level = require('level-party')
const send = require('appa/send')
const error = require('appa/error')
const database = require('./database')
const api = require('./api')

module.exports = function (opts) {
  opts = opts || {}

  const log = bole(__filename)
  const app = require('../client/js/app')
  const page = require('./page')
  const Dat = require('./haus')
  const verify = require('./verify')
  const townshipDb = level(opts.township.db || path.join(__dirname, 'township.db'))
  const ship = township(opts.township, townshipDb)

  const db = database(opts.db)
  for (var name in db.models) {
    var model = db.models[name]
    router.on('/api/v1/' + name, api(model))
  }

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
        log.warn('router.js /:archiveKey route error: ' + e.message)
        return sendSPA('/:archiveKey', req, res, params, state)
      }
      var dat = Dat(key)
      var archive = dat.archive
      state.archive.key = params.archiveKey
      var listStream = archive.list({live: false})
      var cancelled = false
      var timeout = TimeoutStream({
        objectMode: true,
        duration: 3000
      }, () => {
        cancelled = true
        log.warn('server getArchive() timed out for key: ' + params.archiveKey)
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
          dat.close()
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
      fs.readFile('.' + req.url, 'utf-8', function (err, contents) {
        if (err) return res.end('nope')
        res.setHeader('Content-Type', 'image/svg+xml')
        res.end(contents)
      })
    }
  })

  router.on('/auth/v1/register/', {
    post: function (req, res, params) {
      if (!params.email) return error(400, 'must specify email').pipe(res)
      verify(params.email, function (err) {
        if (err) return error(401, err.message).pipe(res)
        ship.register(req, res, params, function (err, obj) {
          if (err) return error(400, err.message).pipe(res)
          send(obj).pipe(res)
        })
      })
    }
  })

  router.on('/auth/v1/login/', {
    post: function (req, res, params) {
      ship.login(req, res, params, function (err, obj) {
        if (err) return error(400, err.message).pipe(res)
        send(obj).pipe(res)
      })
    }
  })

  return router

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
}
