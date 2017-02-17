#!/usr/bin/env node
var fs = require('fs')
var Dat = require('dat-node')
var path = require('path')
var rimraf = require('rimraf')

var loc = path.join(__dirname, 'fixtures')
rimraf(path.join(loc, '.dat'), function () {
  Dat(loc, function (err, dat) {
    if (err) throw err
    dat.importFiles(function () {
    })

    dat.joinNetwork()
    fs.writeFile(path.join(__dirname, 'key.txt'), dat.key.toString('hex'))
  })
})
