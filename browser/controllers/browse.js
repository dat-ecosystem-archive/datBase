var debug = require('debug')('browse')
var qs = require('querystring')
var xhr = require('xhr')

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
      var allMetadats = []

      ractive.set('limit', DEFAULT_PAGE_LIMIT)
      ractive.set('offset', DEFAULT_OFFSET)
      ractive.set('metadats', [])

      function setResults(results) {
        var metadats = ractive.get('metadats')
        ractive.set('metadats', metadats.concat(results))
      }

      function search(query, cb) {
        ractive.set('metadats', [])
        window.ractive.set('searchQuery', query)
        ractive.set('query', query)

        if (!cb) {
          cb = function (err, res, json) {
            if (err) console.error(err)
            setResults(json.rows)
            ractive.set('hasNext', true)
          }
        }

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


      function getResults(query) {
        if (query) search(query)
        else {
          dathubClient.metadats.all(function (err, resp, metadats) {
            if (err) {
              setResults([])
            }
            setResults(metadats.data)
            ractive.set('offset', DEFAULT_OFFSET)
          })
        }
      }

      ractive.on('next', function () {
        // todo: get total results so you know when to stop
        var offset = ractive.get('offset')
        ractive.set('offset',  offset + ractive.get('limit'))
        search(data.query, function (err, res, json) {
          if (json.rows.length === 0) {
            ractive.set('offset', offset)
            ractive.set('hasNext', false)
          } else {
            setResults(json.rows)
          }
        })
      })

      window.ractive.on('browse.search', function (query) {
        getResults(query)
      })

      getResults(data.query)

    }
  }
}