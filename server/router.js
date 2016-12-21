const fs = require('fs')
const getMetadata = require('../client/js/utils/metadata')
const bodyParser = require('body-parser')
const assert = require('assert')
const encoding = require('dat-encoding')
const UrlParams = require('uparams')
const bole = require('bole')
const express = require('express')
const auth = require('./auth')
const api = require('./api')
const getDat = require('./dat')

module.exports = function (opts, db) {
  opts = opts || {}

  const log = bole(__filename)
  const app = require('../client/js/app')
  const page = require('./page')

  var router = express()
  router.use(bodyParser.json()) // support json encoded bodies
  const ship = auth(router, db, opts)
  api(router, db, ship)

  // landing page
  router.get('/', function (req, res) {
    var state = getDefaultAppState()
    sendSPA('/', req, res, state)
  })

  router.get('/view/:archiveKey', function (req, res) {
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA('/view/:archiveKey', req, res, state)
    })
  })

  router.get('/:username/:dataset', function (req, res) {
    db.queries.getDatByShortname(req.params, function (err, dat) {
      if (err) {
        var state = getDefaultAppState()
        state.archive.error = err
        log.warn('could not get dat with ' + req.params, err)
        return sendSPA('/:username/:dataset', req, res, state)
      }
      archiveRoute(dat.url, function (state) {
        log.info('sending', state)
        state.archive.username = req.params.username
        state.archive.dataset = req.params.dataset
        return sendSPA('/:username/:dataset', req, res, state)
      })
    })
  })

  function archiveRoute (key, cb) {
    var state = getDefaultAppState()
    state.archive.key = key
    try {
      state.archive.key = encoding.toStr(key)
    } catch (err) {
      log.warn(key + ' not valid', err)
      state.archive.error = err
      return cb(state)
    }
    getDat(key, function (err, dat, entries) {
      if (err && !entries) {
        log.warn(key + ' timed out', err)
        state.archive.error = err
        return cb(state)
      }
      state.archive.entries = entries
      getMetadata(dat.archive, function (err, metadata) {
        if (err) state.archive.error = new Error('no metadata')
        if (metadata) state.archive.metadata = metadata
        state.archive.health = dat.health.get()
        dat.close()
        return cb(state)
      })
    })
  }

  // TODO: decide on a real static asset setup with cacheing strategy
  router.get('/public/css/:asset', function (req, res, params) {
    fs.readFile('.' + req.url, 'utf-8', function (err, contents) {
      if (err) return res.end('nope')
      res.setHeader('Content-Type', 'text/css')
      res.end(contents)
    })
  })

  // TODO: decide on a real static asset setup with cacheing strategy
  router.get('/public/js/:asset', function (req, res, params) {
    fs.readFile('.' + req.url, 'utf-8', function (err, contents) {
      if (err) return res.end('nope')
      res.setHeader('Content-Type', 'text/javascript')
      res.end(contents)
    })
  })

  // TODO: decide on a real static asset setup with cacheing strategy
  router.get('/public/img/:asset', function (req, res, params) {
    fs.readFile('.' + req.url, 'utf-8', function (err, contents) {
      if (err) return res.end('nope')
      res.setHeader('Content-Type', 'image/svg+xml')
      res.end(contents)
    })
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

  function sendSPA (route, req, res, state) {
    if (!state) state = {}
    const frozenState = Object.freeze(state)
    const contents = app.toString(route, frozenState)
    const urlParams = new UrlParams(req.url)
    res.setHeader('Content-Type', 'text/html')
    var url = req.headers.host + route
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
