var os = require('os')
var path = require('path')
var xtend = require('xtend')
const mockTransport = require('nodemailer-mock-transport')
const postmarkTransport = require('nodemailer-postmark-transport')

var datadir = process.env.DATADIR || (
  (process.env.NODE_ENV || 'development') === 'development'
    ? __dirname : os.homedir())

var config = {
  shared: {
    township: {
      secret: 'very very not secret',
      db: path.join(datadir, 'township.db'),
      email: {
        fromEmail: 'noreply@example.org',
        transport: mockTransport()
      }
    },
    db: {
      dialect: 'sqlite3',
      connection: {
        filename: path.join(datadir, 'sqlite.db')
      },
      useNullAsDefault: true
    },
    whitelist: path.join(__dirname, 'fixtures', 'whitelist.txt'),
    archiver: path.join(datadir, 'archiver'),
    port: process.env.PORT || 8888
  },
  development: {},
  production: () => { return {
    township: {
      publicKey: process.env.TOWNSHIP_PUBKEY,
      privateKey: process.env.TOWNSHIP_PRIVKEY,
      db: path.join(datadir, 'datland-township.db'),
      email: {
        fromEmail: 'noreply@datproject.org',
        transport: postmarkTransport({
          auth: {apiKey: process.env.POSTMARK_KEY}
        })
      }
    },
    db: {
      dialect: 'sqlite3',
      connection: {
        filename: path.join(datadir, 'datland-production.db')
      },
      useNullAsDefault: true
    }
  }
} }

var env = process.env.NODE_ENV || 'development'
module.exports = xtend(config.shared, typeof config[env] === 'function' ? config[env]() : config[env])
