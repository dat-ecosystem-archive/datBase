const fs = require('fs')
const debug = require('debug')('dat-registry')
const path = require('path')
const xtend = require('xtend')

var defaultCfg = require('../config/default')

var env = process.env.NODE_ENV || 'development'

module.exports = function () {
  const input = require(path.join(__dirname, '..', 'config', 'config.' + env + '.js'))
  var config = xtend(defaultCfg, input)
  var datadir = config.data || process.env.DATADIR || path.join(__dirname, '..', 'data')
  if (config.township) {
    var ship = config.township
    ship.db = path.join(datadir, config.township.db)
    if (ship.publicKey) ship.publicKey = fs.readFileSync(path.join(datadir, ship.publicKey)).toString()
    if (ship.privateKey) ship.privateKey = fs.readFileSync(path.join(datadir, ship.privateKey)).toString()
  }
  if (config.db.dialect === 'sqlite3') config.db.connection.filename = path.join(datadir, config.db.connection.filename)
  if (config.archiver === 'archiver') config.archiver = path.join(datadir, config.archiver)
  debug(JSON.stringify(config))
  return config
}
