var debug = require('debug')('browse')
var qs = require('querystring')
var xhr = require('xhr')

var dathubClient = require('../hub')

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

      function setResults(results) {
        ractive.set('metadats', results)
      }

      var nextUrl = null

      function setNext(next) {
        nextUrl = next
      }

      function search(query) {
        window.ractive.set('searchQuery', query)
        ractive.set('query', query)
        var limit = 1
        xhr({
          method: 'GET',
          uri: '/search?' + qs.stringify({
            query: query,
            limit: limit
          }),
          json: true,
        }, function (err, res, json) {
          setResults(json.rows)
          setNext(json.next)
        })
      }

      function getResults(query) {
        if (query) search(query)
        else {
          dathubClient.metadats.all(function (err, metadats) {
            if (err) {
              setResults([])
            }
            setResults(metadats.data)
          })
        }
      }

      getResults(data.query)

      window.ractive.on('browse.search', function (query) {
        getResults(query)
      })

    }
  }
}