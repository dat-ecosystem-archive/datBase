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

      self.on('create', function (event) {
        var data = self.get('metadat')
        metadats.query({
          name: data.name
        }, function (err, json) {
          if (err || (json && json.status === 'error')) return onerror(err)
          if (json.length > 0) return onerror(new Error('A dat already exists with that name.'))
          // CREATE THE DAT !!!
          event.original.preventDefault()
        })
      })

      /** Submit **/

      self.on('publish', function (event) {
        // save the metadat
        var data = self.get('metadat')

        metadats.query({
          url: data.url
        }, function (err, json) {
          if (err || (json && json.status === 'error')) return onerror(err)
          if (json.length > 0) return onerror(new Error('A dat already exists with that URL.'))

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
