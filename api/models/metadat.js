var levelRest = require('level-rest-parser')
var extend = require('extend')
var transports = require('transport-stream')
var concat = require('concat-stream')
var url = require('url')
var hyperquest = require('hyperquest')
var datPing = require('dat-ping')
var debug = require('debug')('api/metadat')

var defaultSchema = require('./metadat.json')

module.exports = function (db, opts) {
  if (!opts) opts = {}
  if (!opts.schema) opts.schema = defaultSchema

  var model = levelRest(db, opts)

  var metadat = {}
  extend(metadat, model) // inheritance

  metadat.authorize = function(params, userData, cb) {
    // if it doesnt have an id we dont need to do custom authorization
    if (!params.id) return cb(null, userData)

    // only allow users to edit their own data
    model.get({id: params.id}, function(err, meta) {
      // if not exists then skip authorization
      if (err) return cb(null, userData)
      // ensure only owner can edit
      if (meta.owner_id !== userData.user.handle) return cb(new Error('action not allowed'))
      else cb(null, userData)
    })
  }

  metadat.post = function (data, opts, cb) {
    var self = this

    self.indexes['url'].find(data.url, function (err, rows) {
      if (err) return cb(err)
      if (rows.length > 0) return cb(new Error('Someone has already published a dat with that url'))
      doit()
    })

    function doit () {
      datPing(data.url, function (err, status) {
        if (err) return cb(new Error('Can\'t find a dat there!'))
        // remove sensitive data
        delete data.username
        delete data.password
        data.status = status

        self.indexes['owner_id'].find(data.owner_id, function (err, rows) {
          if (err) return cb(err)
          if (rows.length > 0) {
            for (i in rows) {
              var row = rows[i]
              if (row.name == data.name) {
                return cb(new Error('You have already published a dat with that name'))
              }
            }
          }
          console.log(data)
          model.post(data, opts, cb)
        })
      }))

      stream.on('error', function (err) {
        if (err.level === 'client-authentication') {
          return cb(new Error('Username or password is incorrect.'))
        }
        if (err.message.indexOf('ENOENT') > -1) {
          return cb(new Error('Could not find a dat there!'))
        }
        return cb(err)
      })
    }
  }

  return metadat
}