#!/usr/bin/env node

var TownshipClient = require('township-client')

var email = process.argv.splice(2)[0]
var password = 'dogsandcats'
if (!email) {
  console.error('populate.js <email-address>')
  process.exit(1)
}

var dat = {
  name: 'test-dat',
  title: 'I like to test dats',
  description: 'THis is a way to test dats',
  url: 'aurl',
  keywords: 'hi, bye'
}

var township = TownshipClient({
  server: 'http://localhost:8080/api/v1'
})

township.register({username: 'admin', password: password, email: email}, function (err, resp, json) {
  if (err && err.message.indexOf('exists') === -1) throw new Error(err.message)
  console.log('logging in', email, password)
  township.login({email: email, password: password}, function (err, resp, json) {
    if (err) throw new Error(err.message)
    township.secureRequest({url: '/dats', method: 'POST', body: dat, json: true}, function (err, resp, json) {
      if (err) throw new Error(err.message)
      console.log('created dat', dat)
    })
  })
})
