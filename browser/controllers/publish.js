var isUrl = require('is-url')
var debug = require('debug')('publish')

var metadats = require('../hub').metadats

module.exports =  function (data) {
  return {
    data: data,
    template: require('../templates/metadat/publish.html'),
    onrender: function () {
      var self = this
      var user = data.user

      self.set('help', help)

      self.set('metadat', {
        url: '',
        owner_id: user.handle
      })

      self.set('loading', false)
      self.set('password', null)
      self.set('username', null)

      /** Submit **/

      self.on('submitOK', function (event) {
        // save the metadat
        var data = self.get('metadat')

        metadats.query({
          url: data.url
        }, function (err, json) {
          if (err || (json && json.status === 'error')) return onerror(err)

          data.readme = '# readme for ' + data.name + '\n\n'
          data.username = self.get('username')
          data.password = self.get('password')

          metadats.create(data, function (err, resp, metadat) {
            if (err) return onerror(err)
            window.location.href = '/view/' + metadat.id;
          })
        })

        event.original.preventDefault()
      })


      /** Observers to reset error states **/

      self.observe('username password', function (newVal, old, keyPath) {
        self.set('loading', false)
      })

      /** Stateful functions **/

      function onerror (err) {
        self.set('loading', false)
        window.ractive.message('error', err.message)
      }
    }
  }
}