#!/usr/bin/env node
const bole = require('bole')
const config = require('../config')
const database = require('./database')
const Server = require('./')

bole.output({
  level: 'info',
  stream: process.stdout
})

const log = bole(__filename)
const PORT = process.env.PORT || process.env.DATLAND_PORT || 8080
const db = database(config.db)
config.log = log
const server = Server(config, db)

server.listen(PORT, function () {
  log.info({
    message: 'listening',
    port: server.address().port,
    env: process.env.NODE || 'undefined'
  })
})

process.once('uncaughtException', function (err) {
  log.error({message: 'error', error: err.message, stack: err.stack})
  console.error(err.stack)
  process.exit(1)
})
