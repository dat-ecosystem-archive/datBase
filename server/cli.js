#!/usr/bin/env node
const path = require('path')
const bole = require('bole')
const db = require('dat-registry-api/database/init')
const Server = require('./')

const env = process.env.NODE_ENV || 'development'
var config = require(path.join(__dirname, '..', 'config', 'config.' + env + '.js'))

bole.output({
  level: 'info',
  stream: process.stdout
})

const PORT = process.env.PORT || process.env.DATLAND_PORT || 8080
config.log = bole(__filename)
const server = Server(config)
db(config, function (err, db) {
  if (err) throw err
  db.knex.destroy(function () {
    server.listen(PORT, function () {
      config.log.info({
        message: 'listening',
        port: server.address().port,
        env: process.env.NODE || 'undefined'
      })
    })

    process.on('SIGINT', function () {
      server.close()
    })

    process.once('uncaughtException', function (err) {
      config.log.error({message: 'error', error: err.message, stack: err.stack})
      console.error(err.stack)
      process.exit(1)
    })
  })
})
