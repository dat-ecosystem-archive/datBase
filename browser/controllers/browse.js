var debug = require('debug')('browse')
var qs = require('querystring')
var xhr = require('xhr')

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

      function search(query, cb) {
        metadatSet.clear()
        window.ractive.set('searchQuery', query)
        self.set('query', query)

        var opts = {
          query: query,
          limit: self.get('limit'),
          offset: self.get('offset')
        }
        for (idx in SEARCH_FIELDS) {
          var field = SEARCH_FIELDS[idx]
          dathubClient.metadats.searchByField(field, opts, cb)
        }
      }

      self.on('next', function () {
        // todo: get total results so you know when to stop
        var offset = self.get('offset')
        var limit = self.get('limit')

        // set new offset
        self.set('offset',  offset + limit)

        // search with new params
        search(data.query, function (err, res, json) {
          if (json.rows.length === 0) {
            self.set('offset', offset)
            self.set('hasNext', false)
          } else {
            metadatSet.addItems(json.rows)
          }
        })
      })

      // the window.ractive fires this event because the search
      // box is in the parent, the 'main.js' ractive
      window.ractive.on('browse.search', function (query) {
        search(query, function (err, json) {
          if (err) console.error(err)
          metadatSet.addItems(json.rows)
          self.set('hasNext', true)
        })
      })

      // ON PAGE LOAD, if there's a query already, search it, else
      // show all of the metadats
      if (data.query) {
        window.ractive.fire('browse.search', data.query)
      }
      else {
        dathubClient.metadats.all(function (err, metadats) {
          if (err) console.error(err)
          metadatSet.clear()
          metadatSet.addItems(metadats.data)
          self.set('offset', DEFAULT_OFFSET)
        })
      }
    }
  }
}