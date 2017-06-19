const fs = require('fs')
const range = require('range-parser')
const debug = require('debug')('dat-registry')
const mime = require('mime')
const pump = require('pump')
const xtend = require('xtend')
const path = require('path')
const compression = require('compression')
const bodyParser = require('body-parser')
const UrlParams = require('uparams')
const express = require('express')
const redirect = require('express-simple-redirect')
const Mixpanel = require('mixpanel')
const app = require('../client/js/app')
const page = require('./page')
const Api = require('dat-registry-api')
const Dats = require('./dats')

module.exports = function (config) {
  config = config || {}

  const dats = config.dats || Dats(config.archiver)
  const mx = Mixpanel.init(config.mixpanel)
  const api = Api(config)
  const db = api.db

  var router = express()
  router.use(compression())
  router.use('/public', express.static(path.join(__dirname, '..', 'public')))
  router.use(bodyParser.json()) // support json encoded bodies
  router.use(redirect({
    '/blog': 'https://blog.datproject.org'
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

  router.get('/api/v1/dats/search', function (req, res) {
    api.db.dats.search(req.query, function (err, resp) {
      if (err) return onerror(err, res)
      res.json(resp)
    })
  })
  router.get('/api/v1/:username/:dataset', function (req, res) {
    db.dats.getByShortname(req.params, function (err, dat) {
      if (err) return onerror(err, res)
      res.json(dat)
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
  router.get('/profile/delete', send)
  router.get('/browser', send)

  router.get('/view', function (req, res) {
    archiveRoute(req.query.query, function (state) {
      if (state.archive.error && state.archive.error.message === 'Invalid key') {
        var url = '/explore' + req._parsedUrl.search
        console.log('redirecting', url)
        return res.redirect(301, url)
      }
      return sendSPA(req, res, state)
    })
  })

  router.get('/explore', function (req, res) {
    var state = getDefaultAppState()
    db.dats.search(req.query, function (err, resp) {
      if (err) return onerror(err, res)
      state.explore.data = resp
      sendSPA(req, res, state)
    })
  })

  router.get('/blog/*', function (req, res) {
    res.redirect(301, 'http://bdatproject.org')
  })

  function onfile (archive, name, req, res) {
    archive.stat(name, function (err, st) {
      if (err) return onerror(err, res)
      debug('file requested', st.size)
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
    debug('getting file contents', req.params)
    dats.get(req.params.archiveKey, function (err, archive) {
      if (err) return onerror(err, res)
      var filename = req.params[0]
      return onfile(archive, filename, req, res)
    })
  })

  router.get('/metadata/:archiveKey', function (req, res) {
    const timeout = parseInt(req.query.timeout) || 1000
    debug('requesting metadata for key', req.params.archiveKey)
    dats.get(req.params.archiveKey, {timeout}, function (err, archive) {
      if (err) return onerror(err, res)
      dats.metadata(archive, {timeout}, function (err, info) {
        if (err) info.error = {message: err.message}
        debug('got', info)
        return res.status(200).json(info)
      })
    })
  })

  router.get('/profile/edit', function (req, res) {
    var state = getDefaultAppState()
    return sendSPA(req, res, state)
  })

  router.get('/:username', function (req, res) {
    var state = getDefaultAppState()
    debug('looking for user', req.params.username)
    db.users.get({username: req.params.username}, function (err, results) {
      if (err) return onerror(err, res)
      if (!results.length) {
        debug('user not found')
        return res.redirect(301, '/dat://' + req.params.username)
      }
      var user = results[0]
      debug('profile views', user)
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
      debug('getting dats')
      db.dats.get({user_id: user.id}, function (err, results) {
        if (err) return onerror(err, res)
        state.profile.dats = results
        debug('sending profile', state.profile)
        return sendSPA(req, res, state)
      })
    })
  })

  router.get('/dat/:archiveKey/contents', function (req, res) {
    // just give me the archive, oopsie.
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })

  router.get('/:username/:dataset', function (req, res) {
    debug('requesting username/dataset', req.params)
    mx.track('shortname viewed', req.params)
    db.dats.getByShortname(req.params, function (err, dat) {
      if (err) {
        var state = getDefaultAppState()
        state.archive.error = {message: err.message}
        debug('could not get dat with ' + req.params, err)
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

  router.get('/dat://:archiveKey', function (req, res) {
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })

  router.get('/dat://:archiveKey/contents', function (req, res) {
    archiveRoute(req.params.archiveKey, function (state) {
      return sendSPA(req, res, state)
    })
  })
  router.get('/dat://:archiveKey/contents/*', function (req, res) {
    debug('getting file contents', req.params)
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
    debug('finding', key)
    var cancelled = false

    function onerror (err) {
      debug(key, err)
      if (cancelled) return true
      cancelled = true
      state.archive.error = {message: err.message}
      return cb(state)
    }

    var timeout = setTimeout(function () {
      var msg = 'timed out'
      if (cancelled) return
      cancelled = true
      return onerror(new Error(msg))
    }, 1000)

    var state = getDefaultAppState()
    mx.track('archive viewed', {key: key})

    dats.get(key, function (err, archive, key) {
      if (err) return onerror(err)
      archive.ready(function () {
        debug('got archive key', key)
        clearTimeout(timeout)
        if (cancelled) return
        cancelled = true

        dats.metadata(archive, {timeout: 1000}, function (err, info) {
          if (err) state.archive.error = {message: err.message}
          state.archive = xtend(state.archive, info)
          state.archive.key = key
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
    for (var key in app.defaults) {
      state[key] = app.defaults[key]
    }
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
