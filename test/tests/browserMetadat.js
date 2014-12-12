var test = require('tape')
var request = require('xhr')

var metadats = require('../../app/api/metadats.js')

test('metadat sanitize', function (t) {
  var metadat_data = {
    name: 'hello',
    description: 'weee'
  }
  var santitized_metadat = metadats.sanitize(metadat_data)
  t.deepEquals(santitized_metadat, metadat_data, 'returns the metadat back')

  metadat_data = {
    name: 'hello  ',
    description: '   wee'
  }
  santitized_metadat = metadats.sanitize(metadat_data)
  t.deepEquals(santitized_metadat, {
    name: 'hello',
    description: 'wee'
  }, 'should strip name and description')

  t.end()
})

test('cant create a metadat without name and description and url', function (t) {
  var metadat_data = {
    name: '',
    description: 'weee',
    url: 'http://metadat.dathub.org'
  }

  metadats.create(metadat_data, function (err, metadat) {
    t.throws(err, 'should error without name')
  })

  metadat_data = {
    name: 'asdfasdf',
    description: '',
    url: 'http://metadat.dathub.org'
  }

  metadats.create(metadat_data, function (err, metadat) {
    t.throws(err, 'should error without description')
  })

  metadat_data = {
    name: '',
    description: '',
    url: 'http://metadat.dathub.org'
  }

  metadats.create(metadat_data, function (err, metadat) {
    t.throws(err, 'should error with no name and desc')
  })

  metadat_data = {
    name: 'asdfasdf',
    description: 'asdfasdf',
    url: ''
  }

  metadats.create(metadat_data, function (err, metadat) {
    t.throws(err, 'should error with no url')
  })

  metadat_data = {
    name: '',
    description: '',
    url: ''
  }

  metadats.create(metadat_data, function (err, metadat) {
    t.throws(err, 'should error with no name, desc, url')
    t.end()
  })
})


test('can create a metadat', function (t) {
  var metadat_data = {
    name: 'ima medatat',
    description: 'weee',
    url: 'http://metadat.dathub.org'
  }
  t.end()

  //skip

  metadats.create(metadat_data, function (err, metadat) {
    t.ifError(err)
    t.ok(metadat.id)
    metadats.getById(metadat.id, function (err, getMetadat) {
      t.ifError(err)
      t.equals(metadat.url, getMetadat.url, 'can create and retrieve the metadat from the js api')
    })
  })
})