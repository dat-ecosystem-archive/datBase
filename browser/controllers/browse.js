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
      var ractive = this
      var metadatSet = new RactiveSet(ractive, 'metadats')

      ractive.set('limit', DEFAULT_PAGE_LIMIT)
      ractive.set('offset', DEFAULT_OFFSET)

      function search(query, cb) {
        metadatSet.clear()
        window.ractive.set('searchQuery', query)
        ractive.set('query', query)

        var opts = {
          query: query,
          limit: ractive.get('limit'),
          offset: ractive.get('offset')
        }
        for (idx in SEARCH_FIELDS) {
          var field = SEARCH_FIELDS[idx]
          dathubClient.metadats.searchByField(field, opts, cb)
        }
      }

      ractive.on('next', function () {
        // todo: get total results so you know when to stop
        var offset = ractive.get('offset')
        var limit = ractive.get('limit')

        // set new offset
        ractive.set('offset',  offset + limit)

        // search with new params
        search(data.query, function (err, res, json) {
          if (json.rows.length === 0) {
            ractive.set('offset', offset)
            ractive.set('hasNext', false)
          } else {
            metadatSet.addItems(json.rows)
          }
        })
      })

      // the window.ractive fires this event because the search
      // box is in the parent, the 'main.js' ractive
      window.ractive.on('browse.search', function (query) {
        search(query, function (err, res, json) {
          if (err) console.error(err)
          metadatSet.addItems(json.rows)
          ractive.set('hasNext', true)
        })
      })

      // ON PAGE LOAD, if there's a query already, search it, else
      // show all of the metadats
      if (data.query) {
        window.ractive.fire('browse.search', data.query)
      }
      else {
        dathubClient.metadats.all(function (err, resp, metadats) {
          if (err) console.error(err)
          metadatSet.clear()
          metadatSet.addItems(metadats.data)
          ractive.set('offset', DEFAULT_OFFSET)
        })
      }
    }
  }
}