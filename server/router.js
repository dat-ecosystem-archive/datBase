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

  const ship = auth(router, db, opts)
  api(router, db, ship)
  router.use('/', express.static(path.join(__dirname, '..', 'public', 'rendered'), {
    setHeaders: function (res, path) {
      res.setHeader('Content-Type', 'text/html')
    }
  }))

  // landing page
  router.get('/install', function (req, res) {
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

  router.get('/download/:archiveKey', function (req, res) {
    var state = getDefaultAppState()
    state.archive.key = req.params.archiveKey
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
    if (filename !== 'dat.json') return onerror(new Error('only gets dat.json files for now, sorry!'), res)
    dats.get(req.params.archiveKey, function (err, archive) {
      if (err) return onerror(err, res)
      archive.get(filename, function (err, entry) {
        if (err && err.code === 'ETIMEDOUT') return onerror(new Error('Timed Out'), res)
        if (err || !entry || entry.type !== 'file') return onerror(new Error('404'), res)

        log.debug('getting entry', entry)
        var range = req.headers.range && rangeParser(entry.length, req.headers.range)[0]

        res.setHeader('Access-Ranges', 'bytes')
        res.setHeader('Content-Type', mime.lookup(filename))
        archive.open(function () {
          if (!range || range < 0) {
            res.setHeader('Content-Length', entry.length)
            if (req.method === 'HEAD') return res.end()
            var stream = archive.createFileReadStream(entry)
            pump(stream, res, function (err) {
              if (err) return onerror(new Error('No sources found'), res)
            })
          } else {
            log.debug('range request', range)
            res.statusCode = 206
            res.setHeader('Content-Length', range.end - range.start + 1)
            res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + entry.length)
            if (req.method === 'HEAD') return res.end()
            pump(archive.createFileReadStream(entry, {start: range.start, end: range.end + 1}), res)
          }
        })
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
        state.archive.username = req.params.username
        state.archive.dataset = req.params.dataset
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
      return onerror(err)
    }
    dats.get(state.archive.key, function (err, archive) {
      if (err) return onerror(err)
      entryStream(archive, function (err, entries) {
        if (err) return onerror(err)
        state.archive.entries = entries
        var peers = archive.content.peers.length - 1
        state.archive.peers = peers < 0 ? 0 : peers
        archive.open(function () {
          state.archive.size = archive.content.bytes
          cb(state)
        })
      })
    })

    function onerror (err) {
      log.warn(key, err)
      state.archive.error = {message: err.message}
      return cb(state)
    }
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
