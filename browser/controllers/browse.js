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
        if (!query) return
        metadatSet.clear()
        self.set('loading', true)
        query = '*' + query + '*'
        self.set('query', query)
        self.set('all', false)

        var opts = {
          query: query,
          limit: self.get('limit'),
          offset: self.get('offset')
        }

        var stream = from.obj(SEARCH_FIELDS).pipe(through.obj(function (field, enc, next) {
          dathubClient.metadats.searchByField(field, opts, function (err, resp, json) {
            if (err) return next(err)
            metadatSet.addItems(json.rows)
            next()
          })
        }))

        stream.on('error', function (err) {
          alert('There was a epic failure. Please open a github issue with your browser\'s console output')
          console.error(err)
          self.set('loading', false)
        })

        stream.on('finish', function () {
          // all items have been loaded
          self.set('loading', false)
          if (self.get('metadats').length === 0) {
            window.ractive.message('warning', 'Could not find any matching queries.')
            all()
          }
        })
      }

      self.on('search', function (event) {
        search(self.get('queryText'))
      })

      // ON PAGE LOAD, if there's a query already, search it, else
      // show all of the metadats
      if (data.query) search(data.query)
      else all()

      function all () {
        self.set('loading', true)
        dathubClient.metadats.all(function (err, resp, metadats) {
          if (err) console.error(err)
          metadatSet.clear()
          metadatSet.addItems(metadats.data)
          self.set('offset', DEFAULT_OFFSET)
          self.set('loading', false)
          self.set('all', true)
        })
      }
    }
  }
}