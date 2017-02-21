const xtend = require('xtend')
const path = require('path')

const config = require('../config')

module.exports = xtend(config, {
  whitelist: path.join(__dirname, 'fixtures', 'whitelist.txt')
})
