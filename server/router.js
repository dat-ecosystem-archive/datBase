const fs = require('fs')
const range = require('range-parser')
const mime = require('mime')
const pump = require('pump')
const xtend = require('xtend')
const path = require('path')
const compression = require('compression')
const bodyParser = require('body-parser')
const assert = require('assert')
const encoding = require('dat-encoding')
const UrlParams = require('uparams')
const bole = require('bole')
const express = require('express')
const redirect = require('express-simple-redirect')
const Mixpanel = require('mixpanel')
const app = require('../client/js/app')
const page = require('./page')
const Api = require('./api')
const Dats = require('./dats')

module.exports = function (config) {
  config = config || {}

  const log = bole(__filename)
  const dats = config.dats || Dats(config.archiver)
  const mx = Mixpanel.init(config.mixpanel)
  const api = Api(config)
  const db = api.db

  var router = express()
  router.use(compression())
  router.use('/public', express.static(path.join(__dirname, '..', 'public')))
  router.use(bodyParser.json()) // support json encoded bodies
  router.use(redirect({
    '/blog': 'http://blog.datproject.org'
  }, 301))

  router.post('/api/v1/users', api.users.post)
  router.get('/api/v1/users', api.users.get)
  router.put('/api/v1/users', api.users.put)
  router.delete('/api/v1/users', api.users.delete)

  router.get('/api/v1/dats', api.dats.get)
  router.post('/api/v1/dats', api.dats.post)
  router.put('/api/v1/dats', api.dats.put)
  router.delete('/api/v1/dats', api.dats.delete)

  router.post('/api/v1/register', api.auth.register)
  router.post('/api/v1/login', api.auth.login)
  router.post('/api/v1/password-reset', api.auth.passwordReset)
  router.post('/api/v1/password-reset-confirm', api.auth.passwordResetConfirm)

  router.get('/api/v1/:username/:dataset', function (req, res) {
    db.queries.getDatByShortname(req.params, function (err, dat) {
      if (err) return onerror(err, res)
      res.json(dat)
    })
  })

  router.get('/api/v1/browse', function (req, res) {
    db.queries.datList(req.params, function (err, resp) {
      if (err) return onerror(err, res)
      res.json(resp)
    })
  })

  function send (req, res) {
    var state = getDefaultAppState()
    sendSPA(req, res, state)
  }

  // landing page
  router.get('/install', send)
  router.get('/register', send)
  router.get('/', send)
  router.get('/about', send)
  router.get('/team', send)
  router.get('/login', send)
  router.get('/reset-password', send)
  router.get('/browser', send)

  router.get('/explore', function (req, res) {
    var state = getDefaultAppState()
    db.queries.datList(req.params, function (err, resp) {
      if (err) return onerror(err, res)
      state.list.data = resp
      sendSPA(req, res, state)
    })
  })

  router.get('/blog/*', function (req, res) {
    res.redirect(301, 'http://blog.datproject.org')
  })

  function onfile (archive, name, req, res) {
    archive.stat(name, function (err, st) {
      if (err) return onerror(err, res)
      log.info('file requested', st.size)
      mx.track('file requested', {size: st.size})

      if (st.isDirectory()) {
        res.statusCode = 302
        res.setHeader('Location', name + '/')
        return
      }

      var r = req.headers.range && range(st.size, req.headers.range)[0]
      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Content-Type', mime.lookup(name))

      if (r) {
        res.statusCode = 206
        res.setHeader('Content-Range', 'bytes ' + r.start + '-' + r.end + '/' + st.size)
        res.setHeader('Content-Length', r.end - r.start + 1)
      } else {
        res.setHeader('Content-Length', st.size)
      }

      if (req.method === 'HEAD') return res.end()
      pump(archive.createReadStream(name, r), res)
    })
  }

  router.get('/download/:archiveKey/*', function (req, res) {
    log.debug('getting file contents', req.params)
    dats.get(req.params.archiveKey, function (err, archive) {
      if (err) return onerror(err, res)
      var filename = req.params[0]
      return onfile(archive, filename, req, res)
    })
  })

  router.get('/metadata/:archiveKey', function (req, res) {
    const timeout = parseInt(req.query.timeout) || 1000
    log.debug('requesting metadata for key', req.params.archiveKey)
    dats.get(req.params.archiveKey, {timeout}, function (err, archive) {
      if (err) return onerror(err, res)
      dats.metadata(archive, {timeout}, function (err, info) {
        if (err) info.error = {message: err.message}
        return res.status(200).json(info)
      })
    })
  })

  router.get('/profile/edit', function (req, res) {
    var state = getDefaultAppState()
    return sendSPA(req, res, state)
  })

  router.get('/profile/:username', function (req, res) {
    var state = getDefaultAppState()
    db.models.users.get({username: req.params.username}, function (err, results) {
      if (err) return onerror(err, res)
      if (!results.length) {
        return archiveRoute(req.params.username, function (state) {
          sendSPA(req, res, state)
        })
      }
      var user = results[0]
      mx.track('profile viewed', {distinct_id: user.email})
      state.profile = {
        username: user.username,
        role: user.role,
        name: user.name,
        data: user.data,
        description: user.description,
        created_at: user.created_at,
        email: user.email,
        id: user.id
      }
      db.models.dats.get({user_id: user.id}, function (err, results) {
        if (err) return onerror(err, res)
        state.profile.dats = results
        return sendSPA(req, res, state)
      })
    })
  })

  router.get('/:archiveKey/contents', function (req, res) {
    // just give me the archive, oopsie.
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })

  router.get('/:username/:dataset', function (req, res) {
    log.debug('requesting username/dataset', req.params)
    mx.track('shortname viewed', req.params)
    db.queries.getDatByShortname(req.params, function (err, dat) {
      if (err) {
        var state = getDefaultAppState()
        state.archive.error = {message: err.message}
        log.warn('could not get dat with ' + req.params, err)
        return sendSPA(req, res, state)
      }
      res.setHeader('Hyperdrive-Key', dat.url)
      var contentType = req.accepts(['html', 'json'])
      if (contentType === 'json') {
        if (err) return onerror(err, res)
        return res.status(200).json(dat)
      }
      archiveRoute(dat.url, function (state) {
        state.archive.id = dat.id
        dat.username = req.params.username
        dat.shortname = req.params.username + '/' + req.params.dataset
        state.archive.metadata = dat
        return sendSPA(req, res, state)
      })
    })
  })

  router.get('/:archiveKey', function (req, res) {
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })

  router.get('/:archiveKey/contents/*', function (req, res) {
    log.debug('getting file contents', req.params)
    var filename = req.params[0]
    archiveRoute(req.params.archiveKey, function (state) {
      dats.get(req.params.archiveKey, function (err, archive) {
        if (err) return onerror(err, res)
        archive.stat(filename, function (err, entry) {
          if (err) {
            state.preview.error = {message: err.message}
            entry = {name: filename}
          }
          entry.name = filename
          entry.archiveKey = req.params.archiveKey
          entry.type = entry.isDirectory
            ? entry.isDirectory() ? 'directory' : 'file'
              : 'file'
          if (entry.type === 'directory') {
            state.archive.root = entry.name
            return sendSPA(req, res, state)
          }
          if (entry.type === 'file') {
            var arr = entry.name.split('/')
            if (arr.length > 1) state.archive.root = arr.splice(0, arr.length - 1).join('/')
          }
          state.preview.entry = entry
          return sendSPA(req, res, state)
        })
      })
    })
  })

  function onerror (err, res) {
    console.trace(err)
    return res.status(400).json({statusCode: 400, message: err.message})
  }

  function archiveRoute (key, cb) {
    // TODO: handle this at the response level?
    var cancelled = false

    function onerror (err) {
      log.warn(key, err)
      if (cancelled) return true
      cancelled = true
      state.archive.error = {message: err.message}
      return cb(state)
    }

    var timeout = setTimeout(function () {
      var msg = 'timed out'
      return onerror(new Error(msg))
    }, 1000)

    var state = getDefaultAppState()
    try {
      key = encoding.toStr(key)
      if (key.length !== 64) return onerror(new Error('Invalid key'))
      state.archive.key = key
    } catch (err) {
      log.warn('key malformed', key)
      mx.track('key malformed', {key: key})
      return onerror(err)
    }
    mx.track('archive viewed', {key: state.archive.key})

    dats.get(state.archive.key, function (err, archive) {
      if (err) return onerror(err)
      archive.ready(function () {
        clearTimeout(timeout)
        if (cancelled) return
        cancelled = true

        dats.metadata(archive, {timeout: 1000}, function (err, info) {
          if (err) state.archive.error = {message: err.message}
          state.archive = xtend(state.archive, info)
          cb(state)
        })
      })
    })
  }

  router.dats = dats
  router.api = api
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
