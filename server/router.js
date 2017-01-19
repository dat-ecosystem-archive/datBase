const fs = require('fs')
const path = require('path')
const compression = require('compression')
const getMetadata = require('../client/js/utils/metadata')
const bodyParser = require('body-parser')
const assert = require('assert')
const encoding = require('dat-encoding')
const UrlParams = require('uparams')
const bole = require('bole')
const express = require('express')
const app = require('../client/js/app')
const Dat = require('./haus')
const page = require('./page')
const auth = require('./auth')
const api = require('./api')
const entryStream = require('./entryStream')
const pkg = require('../package.json')

module.exports = function (opts, db) {
  opts = opts || {}

  var router = express()
  router.use(compression())
  router.use('/public', express.static(path.join(__dirname, '..', 'public')))
  router.use(bodyParser.json()) // support json encoded bodies
  const log = bole(__filename)

  const ship = auth(router, db, opts)
  api(router, db, ship)
  router.use('/', express.static(path.join(__dirname, '..', 'public', 'rendered'), {
    setHeaders: function (res, path) {
      res.setHeader('Content-Type', 'text/html')
    }
  }))

  // landing page
  router.get('/create', function (req, res) {
    var state = getDefaultAppState()
    sendSPA(req, res, state)
  })

  router.get('/list', list)

  function list (req, res) {
    var state = getDefaultAppState()
    var join = ['users', 'users.id', 'dats.user_id']
    db.models.dats.get({limit: 10}, join, function (err, body) {
      if (err) state.error.message = err.message
      state.list.data = body
      sendSPA(req, res, state)
    })
  }

  router.get('/register', function (req, res) {
    var state = getDefaultAppState()
    sendSPA(req, res, state)
  })

  router.get('/login', function (req, res) {
    var state = getDefaultAppState()
    sendSPA(req, res, state)
  })

  router.get('/browser', function (req, res) {
    var state = getDefaultAppState()
    sendSPA(req, res, state)
  })

  router.get('/view/:archiveKey', function (req, res) {
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })

  router.get('/:username/:dataset', function (req, res) {
    db.queries.getDatByShortname(req.params, function (err, dat) {
      if (err) {
        var state = getDefaultAppState()
        state.archive.error = {message: err.message}
        log.warn('could not get dat with ' + req.params, err)
        return sendSPA(req, res, state)
      }
      archiveRoute(dat.url, function (state) {
        state.archive.username = req.params.username
        state.archive.dataset = req.params.dataset
        return sendSPA(req, res, state)
      })
    })
  })

  function archiveRoute (key, cb) {
    var state = getDefaultAppState()
    state.archive.key = key
    var dat
    try {
      state.archive.key = encoding.toStr(key)
      dat = Dat(key)
    } catch (err) {
      return onerror(err)
    }

    function onerror (err) {
      log.warn(key, err)
      state.archive.error = {message: err.message}
      if (dat) return dat.close(function () { cb(state) })
      return cb(state)
    }

    entryStream(dat, function (err, entries) {
      if (err) return onerror(err)
      state.archive.entries = entries
      getMetadata(dat.archive, function (err, metadata) {
        if (err) state.archive.error = {message: err.message}
        if (metadata) state.archive.metadata = metadata
        state.archive.health = dat.health.get()
        dat.close(function () {
          return cb(state)
        })
      })
    })
  }

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
    state.user.version = pkg.version
    return JSON.parse(JSON.stringify(state))
  }

  function sendSPA (req, res, state) {
    var route = req.url
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
