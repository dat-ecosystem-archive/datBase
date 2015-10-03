var metadats = require('../hub').metadats

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/metadat/publish.html'),
    onrender: function () {
      var self = this
      var user = data.user

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

          data.username = self.get('username')
          data.password = self.get('password')

          metadats.create(data, function (err, resp, metadat) {
            if (err) return onerror(err)
            window.location.href = '/view/' + metadat.id
          })
        })

        event.original.preventDefault()
      })

      self.observe('username password', function (newVal, old, keyPath) {
        self.set('loading', false)
      })

      function onerror (err) {
        self.set('loading', false)
        console.log('error', err)
        window.ractive.message('error', err.message)
      }
    }
  }
}
