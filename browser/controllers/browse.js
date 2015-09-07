var debug = require('debug')('browse')
var qs = require('querystring')
var xhr = require('xhr')
$ = jQuery = require('jQuery')
var tablesorter = require('tablesorter')
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
        query = '*' + query + '*'
        self.set('query', query)
        window.location.search = '?query=' + encodeURIComponent(query)

        var opts = {
          query: query,
          limit: self.get('limit'),
          offset: self.get('offset')
        }

        var stream = from.obj(SEARCH_FIELDS).pipe(through.obj(function (field, blah, next) {
          self.set('loading', true)
          dathubClient.metadats.searchByField(field, opts, function (err, resp, json) {
            if (err) return next(err)
            metadatSet.addItems(json.rows)
            next()
          })
        }))

        stream.on('error', function (err) {
          alert('there was an error. Please open a github issue!')
          console.error(err)
          self.set('loading', false)
        })

        stream.on('end', function () {
          // all items have been loaded
          self.set('loading', false)
          $('#list-metadats').trigger('sortReset')
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
          $('#list-metadats').tablesorter({
            theme: 'dropbox'
          })
        })
      }
    }
  }
}