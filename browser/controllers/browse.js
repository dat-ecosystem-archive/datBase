var debug = require('debug')('browse')
var qs = require('querystring')
var xhr = require('xhr')
var from = require('from2')
var through = require('through2')

var RactiveSet = require('../common/RactiveSet.js')
var dathubClient = require('../hub')

var DEFAULT_PAGE_LIMIT = 50;
var DEFAULT_OFFSET = 0;
var SEARCH_FIELDS = ['name', 'description', 'owner_id']


// This page handles displaying search and browse of metadats
module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/browse.html'),
    components: {
      listMetadats: require('../components/list.js')
    },
    onrender: function () {
      var self = this
      var metadatSet = new RactiveSet(self, 'metadats')

      self.set('limit', DEFAULT_PAGE_LIMIT)
      self.set('offset', DEFAULT_OFFSET)

      function search (query) {
        metadatSet.clear()
        self.set('query', query)

        var opts = {
          query: query,
          limit: self.get('limit'),
          offset: self.get('offset')
        }

        var stream = from.obj(SEARCH_FIELDS).pipe(through.obj(function (field, blah, cb) {
          self.set('loading', true)
          dathubClient.metadats.searchByField(field, opts, function (err, resp, json) {
            if (err) return cb(err)
            metadatSet.addItems(json.rows)
            cb()
          })
        }))

        stream.on('error', function (err) {
          alert('there was an error. plz open a github issue <3')
          console.error(err)
        })

        stream.on('end', function () {
          console.log('end')
          self.set('loading', false)
        })

      }

      self.on('search', function (event) {
        search(self.get('queryText'))
      })

      // ON PAGE LOAD, if there's a query already, search it, else
      // show all of the metadats
      if (data.query) {
        search(data.query)
      }
      else {
        self.set('loading', true)
        dathubClient.metadats.all(function (err, resp, metadats) {
          if (err) console.error(err)
          metadatSet.clear()
          metadatSet.addItems(metadats.data)
          self.set('offset', DEFAULT_OFFSET)
          self.set('loading', false)
        })
      }
    }
  }
}