var os = require('os')
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
    cachedb: path.join(__dirname, '.datcache'),
    port: process.env.PORT || 8888
  },
  test: {
    whitelist: path.join(__dirname, 'fixtures', 'whitelist.txt'),
  },
  development: {},
  production: {
    township: {
      publicKey: process.env.TOWNSHIP_PUBKEY,
      privateKey: process.env.TOWNSHIP_PRIVKEY,
      db: path.join(datadir, 'datland-township.db'),
      email: {
        fromEmail: 'noreply@datproject.org',
        postmarkAPIKey: process.env.POSTMARK_KEY
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
}

var env = process.env.NODE_ENV || 'development'
var myconfig = xtend(config.shared, config[env])
module.exports = myconfig
