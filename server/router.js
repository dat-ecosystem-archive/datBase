const fs = require('fs')
const getMetadata = require('../client/js/utils/metadata')
const assert = require('assert')
const datKey = require('dat-key-as')
const UrlParams = require('uparams')
const bole = require('bole')
const Router = require('server-router')
const auth = require('./auth')
const api = require('./api')
const getDat = require('./dat')

module.exports = function (opts, db) {
  opts = opts || {}

  const log = bole(__filename)
  const app = require('../client/js/app')
  const page = require('./page')

  var router = Router()
  const ship = auth(router, db, opts)
  api(router, db, ship)

  // landing page
  router.on('/', {
    get: function (req, res, params) {
      var state = getDefaultAppState()
      sendSPA('/', req, res, params, state)
    }
  })

  function archiveRoute (key, cb) {
    var state = getDefaultAppState()
    state.archive.key = key
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
        dat.close()
        return cb(state)
      })
    })
  }

  router.on('/view/:archiveKey', {
    get: function (req, res, params) {
      archiveRoute(params.archiveKey, function (state) {
        return sendSPA('/view/:archiveKey', req, res, params, state)
      })
    }
  })

  router.on('/:username/:dataset', {
    get: function (req, res, params) {
      // TOOD: do it in one db query not two
      db.models.users.get({username: params.username}, function (err, user) {
        if (err) return res.end(err.message)
        if (!user.id) return sendSPA('/404', req, res, params, {})
        db.models.dats.get({user_id: user.id, name: params.dataset}, function (err, results) {
          if (err) return res.end(err.message)
          var dat = results[0]
          if (!dat) return sendSPA('/404', req, res, params, {})
          try {
            archiveRoute(datKey.string(dat.url), function (state) {
              sendSPA('/:username/:dataset', req, res, params, state)
            })
          } catch (e) {
            log.warn('archive route busted', err)
            sendSPA('/404', req, res, params, {})
          }
        })
      })
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
