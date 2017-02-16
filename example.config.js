var os = require('os')
var fs = require('fs')
var path = require('path')
var xtend = require('xtend')

var datadir = process.env.DATADIR || (
  (process.env.NODE_ENV || 'development') === 'development'
    ? __dirname : os.homedir())

var config = {
  shared: {
    township: {
      secret: 'very very not secret',
      db: path.join(datadir, 'township.db'),
      email: {
        fromEmail: 'hi@example.com',
        postmarkAPIKey: 'your api key'
      }
    },
    db: {
      dialect: 'sqlite3',
      connection: {
        filename: path.join(datadir, 'sqlite.db')
      },
      useNullAsDefault: true
    },
    whitelist: path.join(datadir, 'invited-users', 'README'),
    archiver: path.join(datadir, 'archiver'),
    port: process.env.PORT || 8888
  },
  development: {},
  production: {
    township: {
      db: path.join(datadir, 'datland-township.db'),
      email: {
        fromEmail: 'noreply@datproject.org',
        postmarkAPIKey: process.env.POSTMARK_KEY
      },
      algorithm: 'ES512'
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
if (process.env.NODE_ENV === 'production') {
  config.production.township.publicKey = fs.readFileSync(path.join(datadir, 'secrets', 'ecdsa-p521-public.pem')).toString()
  config.production.township.privateKey = fs.readFileSync(path.join(datadir, 'secrets', 'ecdsa-p521-private.pem')).toString()
}

var env = process.env.NODE_ENV || 'development'
module.exports = xtend(config.shared, config[env])
