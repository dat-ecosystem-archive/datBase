#!/usr/bin/env node
const fs = require('fs')
const Dat = require('dat-node')
const path = require('path')
const rimraf = require('rimraf')

module.exports = newDat

function newDat (loc, cb) {
  rimraf(path.join(loc, '.dat'), function () {
    Dat(loc, function (err, dat) {
      if (err) return cb(err)
      dat.importFiles()
      dat.joinNetwork()
      fs.writeFile(path.join(__dirname, 'key.txt'), dat.key.toString('hex'))
      cb(null, dat)
    })
  })
}

if (!module.parent) {
  newDat(path.join(__dirname, 'fixtures'), function (err, dat) {
    if (err) throw err
    console.log('listening to', dat.key.toString('hex'))
  })
}
