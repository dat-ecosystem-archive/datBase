var path = require('path')
var debug = require('debug')('test-common')
var st = require("st")
var request = require('request').defaults({json: true})
var rimraf = require('rimraf')
var jar = request.jar()

var Server = require('../api')
var defaults = require('../api/defaults.js')
var testUser = require('./testUser.json')

module.exports = function(opts) {
  var common = {}
  if (!opts) opts = {}
  opts.debug = opts.debug || false

  common.testPrefix = ''

  common.login = function(api, cb) {
    request({
      url: 'http://localhost:' + api.options.PORT + "/auth/github/testlogin",
      jar: jar,
      json: true
    },  function (err, res, data) {
      cb(err, jar, res)
    })
  }

  common.testGET = function (t, path, cb) {
    this.getRegistry(t, function(err, api, done) {
      if (err) t.ifErr(err)
      common.login(api, function(err, jar) {
        if (err) t.ifErr(err)
        params = {
          method: 'GET',
          jar: jar,
          uri: 'http://localhost:' + api.options.PORT + path
        }
        debug('requesting', params)
        request(params, function get(err, res, json) {
          cb(err, api, jar, res, json, done)
        })
      })
    })
  }

  common.testPOST = function (t, path, data, cb) {
    this.getRegistry(t, function(err, api, done) {
      if (err) t.ifErr(err)
      common.login(api, function(err, jar) {
        if (err) t.ifErr(err)
        params = {
          method: 'POST',
          uri: 'http://localhost:' + api.options.PORT + path,
          json: data,
          jar: jar,
          'content-type': 'application/json'
        }
        debug('requesting', params)
        request(params, function get(err, res, json) {
          cb(err, api, jar, res, json, done)
        })
      })
    })
  }

  common.getRegistry = function (t, cb) {
    if (cb == undefined) {
      cb = t
    }

    defaults.DEBUG = true
    var api = Server(defaults)
    var port = api.options.PORT

    api.router.addRoute('/auth/github/testlogin', function(req, res, params) {
      debug('testlogin!')
      api.auth.github.getOrCreate(testUser, function(err, user) {
        if (err) {
          res.statusCode = 500
          res.end(JSON.stringify({error: err.message}))
          return
        }
        api.sessions.login(res, {id: user.handle}, function(err, session) {
          if (err) {
            res.statusCode = 500
            res.end(JSON.stringify({error: err.message}))
            return
          }
          res.end(JSON.stringify(session))
        })
      })
    })

    api.server.listen(port, function() {
      console.log('listening on port', port)
      cb(null, api, done)
    })

    function done() {
      setTimeout(destroy, 100) // fixes weird test errors on travis-ci

      function destroy(debug) {
        if (debug || opts.debug) return closeTheThings()

        rimraf(defaults.DAT_REGISTRY_DB, function () {
          rimraf(defaults.DAT_SEARCH_DB, function () {
            closeTheThings()
          })
        })
      }

      function closeTheThings() {
        api.close(function(err) {
          if (err) console.error('test db close err', err)
          if (t && t.end) t.end()
        })
      }

    }

  }

  return common
}
