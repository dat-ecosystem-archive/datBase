const township = require('township')
const path = require('path')
const response = require('response')
const level = require('level-party')
const verify = require('./verify')
const errors = require('../errors')
const createEmail = require('township-email')
const createReset = require('township-reset-password-token')

module.exports = function (router, db, opts) {
  const townshipDb = level(opts.township.db || path.join(__dirname, 'township.db'))
  const ship = township(townshipDb, opts.township)
  const reset = createReset(townshipDb, {
    secret: 'not a secret' // passed to jsonwebtoken
  })

  var email
  if (opts.email) {
    email = createEmail({
      transport: opts.email.transport
    })
  }

  function onerror (err, res) {
    var data = {statusCode: 400, message: errors.humanize(err).message}
    return response.json(data).status(400).pipe(res)
  }

  router.post('/api/v1/register', function (req, res) {
    if (!req.body) return onerror(new Error('Requires email and username.'), res)
    if (!req.body.email) return onerror(new Error('Email required.'), res)
    if (!req.body.username) return onerror(new Error('Username required.'), res)
    verify(req.body, {whitelist: opts.whitelist}, function (err) {
      if (err) return onerror(err, res)
      ship.register(req, res, {body: req.body}, function (err, statusCode, obj) {
        if (err) return onerror(err, res)
        db.models.users.create({email: req.body.email, username: req.body.username}, function (err, body) {
          if (err) return onerror(err, res)
          body.token = obj.token
          body.key = obj.key
          return response.json(body).status(200).pipe(res)
        })
      })
    })
  })

  router.post('/api/v1/login', function (req, res) {
    var body = req.body
    if (!body) return onerror(new Error('Requires email and password.'), res)
    ship.login(req, res, {body: body}, function (err, resp, obj) {
      if (err) return onerror(err, res)
      db.models.users.get({email: body.email}, function (err, results) {
        if (err) return onerror(err, res)
        if (!results.length) return onerror(new Error('User does not exist.'), res)
        var user = results[0]
        obj.email = user.email
        obj.username = user.username
        obj.role = user.role
        obj.description = user.description
        return response.json(obj).status(200).pipe(res)
      })
    })
  })

  router.post('/api/v1/password-reset', function (req, res, ctx) {
    if (!email) return onerror(new Error('config.email not set.'))
    const userEmail = req.body.email
    ship.accounts.findByEmail(userEmail, function (err, account) {
      if (err) return onerror(new Error('account not found'), res)
      var accountKey = account.auth.key
      reset.create({ accountKey: accountKey }, function (err, token) {
        if (err) return onerror(new Error('problem creating reset token'), res)
        const clientHost = process.env.VIRTUAL_HOST
          ? `https://${process.env.VIRTUAL_HOST}`
          : 'http://localhost:8080'
        var reseturl = `${clientHost}/reset-password?accountKey=${accountKey}&resetToken=${token}&email=${userEmail}`

        var emailOptions = {
          to: userEmail,
          from: opts.email.fromEmail,
          subject: 'Reset your password at datproject.org',
          html: `<div>
            <p>Hello!</p>
            <p>You recently requested to reset your password. If that wasn't you, you can delete this email.</p>
            <p>Reset your password by clicking this link:</p>
            <p><b><a href="${reseturl}">Reset password</a></b></p>
            <p>Or by following this url:</p>
            <p><a href="${reseturl}">${reseturl}</a></p>
          </div>`
        }

        email.send(emailOptions, function (err, info) {
          if (err) return onerror(err, res)
          if (opts.email.transport.name === 'Mock') {
            console.log('mock email sent', emailOptions)
          }
          return response.json({ message: 'Check your email to finish resetting your password' }).pipe(res)
        })
      })
    })
  })

  router.post('/api/v1/password-reset-confirm', function (req, res, ctx) {
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
        response.json({ message: 'password successfully reset' }).pipe(res)
      })
    })
  })

  return ship
}
