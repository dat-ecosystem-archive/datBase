const fs = require('fs')
const rangeParser = require('range-parser')
const mime = require('mime')
const pump = require('pump')
const path = require('path')
const compression = require('compression')
const bodyParser = require('body-parser')
const assert = require('assert')
const encoding = require('dat-encoding')
const UrlParams = require('uparams')
const bole = require('bole')
const express = require('express')
const redirect = require('express-simple-redirect')
const entryStream = require('./entryStream')
const app = require('../client/js/app')
const page = require('./page')
const auth = require('./auth')
const api = require('./api')
const pkg = require('../package.json')
const Dats = require('./dats')

module.exports = function (opts, db) {
  opts = opts || {}

  const log = bole(__filename)
  const dats = opts.dats || Dats(opts.archiver)

  var router = express()
  router.use(compression())
  router.use('/public', express.static(path.join(__dirname, '..', 'public')))
  router.use(bodyParser.json()) // support json encoded bodies
  router.use(redirect({
    '/blog/2017-01-10-dat-desktop-is-here': '/blog/2017-02-21-dat-desktop-is-here'
  }, 301))

  const ship = auth(router, db, opts)
  api(router, db, ship)

  function send (req, res) {
    var state = getDefaultAppState()
    sendSPA(req, res, state)
  }

  // landing page
  router.get('/install', send)
  router.get('/register', send)
  router.get('/', send)
  router.get('/blog', send)
  router.get('/blog/:name', send)
  router.get('/about', send)
  router.get('/team', send)
  router.get('/login', send)
  router.get('/reset-password', send)
  router.get('/browser', send)

  router.get('/list', function (req, res) {
    var state = getDefaultAppState()
    db.queries.datList(req.params, function (err, resp) {
      if (err) return onerror(err, res)
      state.list.data = resp
      sendSPA(req, res, state)
    })
  })

  router.get('/download/:archiveKey', function (req, res) {
    var state = getDefaultAppState()
    state.archive.key = req.params.archiveKey
    sendSPA(req, res, state)
  })

  router.get('/dat/:archiveKey', function (req, res) {
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })

  router.get('/view/:archiveKey', function (req, res) {
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })

  router.get('/dat/:archiveKey/*', function (req, res) {
    log.debug('getting file contents', req.params)
    var filename = req.params[0]
    dats.get(req.params.archiveKey, function (err, archive) {
      if (err) return onerror(err, res)
      dats.file(req.params.archiveKey, filename, function (err) {
        if (err) return onerror(err, res)
        return dats.http.file(req, res, archive, filename)
      })
    })
  })

  router.get('/:username/:dataset', function (req, res) {
    log.debug('requesting username/dataset', req.params)
    db.queries.getDatByShortname(req.params, function (err, dat) {
      var contentType = req.accepts(['html', 'json'])
      if (contentType === 'json') {
        if (err) return onerror(err, res)
        return res.status(200).json(dat)
      }
      if (err) {
        var state = getDefaultAppState()
        state.archive.error = {message: err.message}
        log.warn('could not get dat with ' + req.params, err)
        return sendSPA(req, res, state)
      }
      archiveRoute(dat.url, function (state) {
        state.archive.id = dat.id
        dat.username = req.params.username
        dat.shortname = req.params.dataset
        state.archive.metadata = dat
        return sendSPA(req, res, state)
      })
    })
  })

  function onerror (err, res) {
    return res.status(400).json({statusCode: 400, message: err.message})
  }

  function archiveRoute (key, cb) {
    var state = getDefaultAppState()
    try {
      state.archive.key = encoding.toStr(key)
    } catch (err) {
      log.warn('key malformed', key)
      return onerror(err)
    }
    dats.get(state.archive.key, function (err, archive) {
      if (err) return onerror(err)
      log.info('got archive', archive.key.toString('hex'))
      entryStream(archive, function (err, entries) {
        if (err) return onerror(err)
        log.info('got %s entries without error', entries.length)
        state.archive.entries = entries
        state.archive.peers = getPeers(archive.metadata.peers)
        cb(state)
      })
    })

    function onerror (err) {
      log.warn(key, err)
      state.archive.error = {message: err.message}
      return cb(state)
    }
  }

  function getPeers (peers) {
    var ar = {}
    for (var i = 0; i < peers.length; i++) {
      var peer = peers[i]
      if (!peer.stream || !peer.stream.remoteId) continue
      ar[peer.stream.remoteId.toString('hex')] = 1
    }
    var count = Object.keys(ar).length
    log.info('got', count, 'peers')
    return count
  }

  router.dats = dats
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
