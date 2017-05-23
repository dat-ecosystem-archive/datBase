var os = require('os')
var fs = require('fs')
var path = require('path')
var xtend = require('xtend')

const mockTransport = require('nodemailer-mock-transport')
const postmarkTransport = require('nodemailer-postmark-transport')

var datadir = process.env.DATADIR || (
  (process.env.NODE_ENV || 'development') === 'development'
    ? path.join(__dirname, '..') : os.homedir())

var config = {
  shared: {
    sentry: process.env.SENTRY,
    township: {
      secret: 'very very not secret',
      db: path.join(datadir, 'township.db')
    },
    email: {
      fromEmail: 'hi@example.com',
      transport: mockTransport()
    },
    db: {
      dialect: 'sqlite3',
      connection: {
        filename: path.join(datadir, 'sqlite.db')
      },
      useNullAsDefault: true
    },
    archiver: path.join(datadir, 'archiver'),
    port: process.env.PORT || 8888
  },
  development: {},
  test: {
    whitelist: false
  },
  production: () => {
    return {
      township: {
        db: path.join(datadir, 'datland-township.db'),
        publicKey: fs.readFileSync(path.join(datadir, 'secrets', 'ecdsa-p521-public.pem')).toString(),
        privateKey: fs.readFileSync(path.join(datadir, 'secrets', 'ecdsa-p521-private.pem')).toString(),
        algorithm: 'ES512'
      },
      email: {
        fromEmail: 'noreply@datproject.org',
        transport: postmarkTransport({
          auth: {apiKey: process.env.POSTMARK_KEY}
        })
      },
      db: {
        dialect: 'sqlite3',
        connection: {
          filename: path.join(datadir, 'datland-production.db')
        },
        useNullAsDefault: true
      }
    }
  }
}

var env = process.env.NODE_ENV || 'development'
module.exports = xtend(config.shared, typeof config[env] === 'function' ? config[env]() : config[env])
module.exports.xtend = function (config) {
  return xtend(module.exports, config)
}
