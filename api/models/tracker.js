var extend = require('extend')
var debug = require('debug')('trackers')
var levelRest = require('level-rest-parser')

var schema = require('./trackers.json')

module.exports = function (db, opts) {
  if (!opts) opts = {}
  if (!opts.schema) opts.schema = schema

  var model = levelRest(db, opts)

  var tracker = {}
  extend(tracker, model) // inheritance

  tracker.authorize = function (opts, userData, cb) {
    // only allow admins to edit and add trackers
    if (opts.serverOpts.ADMINS.indexOf(userData.user.handle) === -1)  return cb(new Error('action not allowed'))
    else cb(null, userData)
  }

  return tracker
}
