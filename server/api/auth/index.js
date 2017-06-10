const township = require('township')
const path = require('path')
const response = require('response')
const level = require('level-party')
const verify = require('./verify')
const errors = require('../errors')
const Mixpanel = require('mixpanel')
const createReset = require('./reset')

module.exports = function (config) {
  var db = config.db
  const townshipDb = level(config.township.db || path.join(__dirname, 'township.db'))
  const ship = township(townshipDb, config.township)
  const mx = Mixpanel.init(config.mixpanel)
  var reset
  if (config.email) reset = createReset(config, townshipDb)

  function onerror (err, res) {
    var data = {statusCode: 400, message: errors.humanize(err).message}
    return response.json(data).status(400).pipe(res)
  }

  return {
    currentUser: currentUser,
    register: register,
    login: login,
    passwordReset: passwordReset,
    passwordResetConfirm: passwordResetConfirm
  }

  function currentUser (req, cb) {
    var authHeader = req.headers.authorization
    if (authHeader && authHeader.indexOf('Bearer') > -1) {
      var token = authHeader.split('Bearer ')[1]
      if (!token) return cb(null)
    }
    if (!authHeader) return cb(null)
    ship.verify(req, function (err, decoded, token) {
      if (err) return cb(err)
      if (!decoded) return cb(null)
      db.models.users.get({email: decoded.auth.basic.email}, function (err, results) {
        if (err) return cb(err)
        var user = results[0]
        return cb(null, user)
      })
    })
  }

  function register (req, res) {
    if (!req.body) return onerror(new Error('Requires email and username.'), res)
    if (!req.body.email) return onerror(new Error('Email required.'), res)
    if (!req.body.username) return onerror(new Error('Username required.'), res)
    verify(req.body, {whitelist: config.whitelist}, function (err) {
      if (err) return onerror(err, res)
      ship.register(req, res, {body: req.body}, function (err, statusCode, obj) {
        if (err) {
          mx.track('registration failed', {distinct_id: req.body.email, body: req.body, reason: err.message})
          return onerror(err, res)
        }
        db.models.users.create({email: req.body.email, username: req.body.username}, function (err, body) {
          if (err) return onerror(err, res)
          mx.people.set(req.body.email, body)
          body.token = obj.token
          body.key = obj.key
          return response.json(body).status(200).pipe(res)
        })
      })
    })
  }

  function login (req, res) {
    var body = req.body
    if (!body) return onerror(new Error('Requires email and password.'), res)
    ship.login(req, res, {body: body}, function (err, resp, obj) {
      if (err) {
        mx.track('login failed', {distinct_id: body.email, reason: err.message})
        return onerror(err, res)
      }
      db.models.users.get({email: body.email}, function (err, results) {
        if (err) return onerror(err, res)
        if (!results.length) {
          err = new Error('User does not exist.')
          mx.track('login failed', {distinct_id: body.email, reason: err.message})
          return onerror(err, res)
        }
        var user = results[0]
        obj.email = user.email
        obj.username = user.username
        obj.role = user.role
        obj.name = user.name
        obj.description = user.description

        // mixpanel modifies incoming object, copy it
        var tracked = Object.assign({}, obj)
        mx.track('login', tracked)
        mx.people.increment(body.email, 'logins')
        mx.people.set(body.email, tracked)

        return response.json(obj).status(200).pipe(res)
      })
    })
  }

  function passwordReset (req, res) {
    if (!reset) return onerror(new Error('config.email not set.'))
    const userEmail = req.body.email
    ship.accounts.findByEmail(userEmail, function (err, account) {
      if (err) return onerror(new Error('account not found'), res)
      var accountKey = account.auth.key
      return reset.mail(userEmail, accountKey, function (err) {
        if (err) return onerror(err, res)
        mx.people.increment(req.body.email, 'reset password')
        return response.json({ message: 'Check your email to finish resetting your password' }).pipe(res)
      })
    })
  }

  function passwordResetConfirm (req, res) {
    const body = req.body
    var options = {
      key: body.accountKey,
      basic: {
        email: body.email,
        password: body.newPassword
      }
    }

    ship.accounts.auth.update(options, function (err, account) {
      if (err) return onerror(new Error('problem confirming password reset'), res)
      reset.confirm({ token: body.resetToken, accountKey: body.accountKey }, function (err) {
        if (err) return onerror(new Error('reset token not valid'), res)
        mx.people.increment(req.body.email, 'reset password confirm')
        response.json({ message: 'password successfully reset' }).pipe(res)
      })
    })
  }
}
