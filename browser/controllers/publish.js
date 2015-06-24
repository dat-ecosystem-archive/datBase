var isUrl = require('is-url')
var debug = require('debug')('publish')

var metadats = require('../hub').metadats

module.exports =  function (data) {
  return {
    data: data,
    template: require('../templates/metadat/publish.html'),
    onrender: function () {
      var self = this
      var dat = null;
      var user = data.user
      self.set('metadat', {
        url: '',
        owner_id: user.handle
      })

      self.set('loading', false)
      self.set('urlError', false)
      self.set('authorizeError', false)
      self.set('password', null)
      self.set('username', null)
      self.set('existingDat', null)

      /** Submit **/

      self.on('submitOK', function (event) {
        // save the metadat
        var data = self.get('metadat')

        metadats.query({
          url: data.url
        }, function (err, json) {
          if (err || json) {
            if (json.status == 'error') {
              return onURLError()
            }
            if (json.length > 0 && json[0].url == url) {
              onURLError()
              self.set('existingDat', json)
              return
            }
          }

          data.readme = '# ' + data.name + '\n\n## How can I use this dataset?'
          data.username = self.get('username')
          data.password = self.get('password')

          metadats.create(data, function (err, resp, metadat) {
            if (err) {
              self.set('submitError', true)
              window.ractive.message('error', err.message)
              return
            }

            self.set('submitError', false)
            window.location.href = '/view/' + metadat.id;
          })
        })

        event.original.preventDefault();
      })


      /** Observers to reset error states **/

      self.observe('username password', function (newVal, old, keyPath) {
        self.set('loading', false)
        self.set('authorizeError', false)
      })

      self.observe('metadat.name metadat.description', function (newVal, old, keyPath) {
        self.set('submitError', false)
      })

      /** Stateful functions **/

      function onURLError() {
        self.set('urlError', true)
        self.set('loading', false)
      }
    }
  }
}