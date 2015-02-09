var debug = require('debug')('browse')
var qs = require('querystring')
var xhr = require('xhr')

var dathubClient = require('../hub')

var DEFAULT_PAGE_LIMIT = 1;
var DEFAULT_OFFSET = 0;

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

      function setResults(results) {
        ractive.set('metadats', results)
      }

      function search(query, cb) {
        // Search the metadats for a given search query.
        // cb: function (optional)
        //   what to do with the results on return.
        //   cb(err, res, json)

        window.ractive.set('searchQuery', query)
        ractive.set('query', query)
        console.log('searching')

        if (!cb) {
          cb = function (err, res, json) {
            // TODO: handle error
            setResults(json.rows)
            ractive.set('hasNext', true)
          }
        }

        xhr({
          method: 'GET',
          uri: '/search?' + qs.stringify({
            query: query,
            limit: ractive.get('limit'),
            offset: ractive.get('offset')
          }),
          json: true,
        }, cb)
      }

      function getResults(query) {
        if (query) search(query)
        else {
          dathubClient.metadats.all(function (err, metadats) {
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