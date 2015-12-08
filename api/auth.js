var debug = require('debug')('publicbits/auth')
var concat = require('concat-stream')
var crypto = require('crypto')
var shasum = require('shasum')
var response = require('response')
var pipe = require('pump')

var auth = function (db, creds, cb) {
  db.users.getOne({ email: creds.email }, function (err, row) {
    if (err) return cb(err)

    // borrowed from substack/accountdown-basic
    if (!row.salt) return cb('NOSALT', 'integrity error: no salt found')
    if (!row.hash) return cb('NOHASH', 'integrity error: no hash found')
    var pw = Buffer(creds.password)
    var salt = Buffer(row.salt, 'hex')
    var h = shasum(Buffer.concat([ salt, pw ]))
    if (h === row.hash) return cb(null, row)
    else cb({status: 401}, row)
  })
}

var generateCreds = function (db, password) {
  var salt = crypto.randomBytes(16)
  var pw = Buffer(password)
  return {
    hash: shasum(Buffer.concat([ salt, pw ])),
    salt: salt.toString('hex')
  }
}

module.exports = function (db, router) {
  router.set('/auth/login', function (req, res, opts, cb) {
    pipe(req, concat(function (body) {
      try {
        var user = JSON.parse(body)
      } catch (err) {
        return cb(err)
      }
      if (!user.email || !user.password) return cb(new Error('Email and password required.'))
      auth(db, {email: user.email, password: user.password}, function (err, user) {
        if (err) {
          res.writeHead(err.status, {'WWW-Authenticate': 'Basic realm="Secure Area"'})
          return response.json({error: 'Login failed.'}).pipe(res)
        }
        debug('Logging in', user.email)
        response.json({
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          verified: user.verified
        }).pipe(res)
      })
      return
    }), function (err) {
      if (err) return cb(err)
    })
  })

  router.set('/auth/verify', function (req, res, opts, cb) {
    pipe(req, concat(function (body) {
      try {
        var user = JSON.parse(body)
      } catch (err) {
        return cb(err)
      }
      if (!user.email) return cb(new Error('Email required.'))
      debug('verifying', user.email)

      db.users.put({
        email: user.email,
        verified: true
      }, function (err, row) {
        if (err) return cb(err)
        response.json({updated: true}).pipe(res)
      })
    }), function (err) {
      if (err) return cb(err)
    })
  })

  router.set('/auth/create', function (req, res, opts, cb) {
    pipe(req, concat(function (body) {
      try {
        var user = JSON.parse(body)
      } catch (err) {
        return cb(err)
      }
      if (!user.email || !user.password) return cb(new Error('Email and password required.'))
      debug('creating', user.email)
      var creds = generateCreds(user.password)
      db.users.put({
        email: user.email,
        password: user.password,
        verified: false,
        hash: creds.hash,
        salt: creds.salt
      }, function (err, row) {
        if (err) return cb(err)
        debug('id', row.insertId)
        res.writeHead(201)
        res.end()
      })
    }), function (err) {
      if (err) return cb(err)
    })
  })

  router.set('/auth/change_password', function (req, res, opts, cb) {
    pipe(req, concat(function (body) {
      try {
        var user = JSON.parse(body)
      } catch (err) {
        return cb(err)
      }
      if (!user.email || !user.newPassword) return cb(new Error('Email and newPassword required.'))
      debug('changing password', user.email)
      var creds = generateCreds(user.newPassword)
      db.users.put({
        email: user.email,
        hash: creds.hash,
        salt: creds.salt
      }, function (err, row) {
        if (err) return cb(err)
        res.writeHead(200)
        response.json({updated: true}).pipe(res)
      })
    }), function (err) {
      if (err) return cb(err)
    })
  })

  router.set('/auth/remove', function (req, res, opts, cb) {
    pipe(req, concat(function (body) {
      try {
        var user = JSON.parse(body)
      } catch (err) {
        return cb(err)
      }
      if (!user.id) return cb(new Error('Id required.'))
      debug('removing', user.id)
      db.users.del({
        id: user.id
      }, function (err, row) {
        if (err) return cb(err)
        res.writeHead(200)
        res.end()
      })
    }), function (err) {
      if (err) return cb(err)
    })
  })
}
