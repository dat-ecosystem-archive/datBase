var isUrl = require('is-url')
var debug = require('debug')('publish')

var dathubClient = require('../hub')
var datClient = require('dat-api-client')

module.exports =  function (data) {

  return {
    data: data,
    template: require('../templates/metadat/publish.html'),
    onrender: function () {
      var self = this
      var dat = null;
      var user = data.user;

      self.set('metadat', {
        url: 'https://',
        owner_id: user.handle
      })

      self.set('loading', false)
      self.set('urlError', false)
      self.set('authorizeError', false)
      self.set('adminPassword', null)
      self.set('adminUsername', null)
      self.set('metadat.status', null)
      self.set('existingDat', null)

      // url needs to be checked
      var url = self.get('metadat.url')

      // if it doesnt have http://, add it.
      if (!/^http/.test(url)) {
        url = 'http://' + url
      }

      /* Get the metadat preview
       * TODO: it might be nice to move this to the metadat object.
       */
      function getPreview(url) {
        self.set('loading', true)

        var client = new datClient({
          url: url
        })
        // call the dat
        client.info(function (err, json) {
          self.set('loading', false)
          if (err) {
            console.error(err.message)
            // maybe they don't know its https? replace http with https
            if (/^http:\/\//.test(url)) {
              url = url.replace('http://', 'https://')
              return getPreview(url)
            }

            // if that didn't work it just failed. go back to beginning.
            onURLError();
            return;
          }

          // set up the metadat with the correct url
          self.set('metadat.url', url)
          onPreviewSuccess(json)
        })
      }

      /** Authorize **/

      self.on('authorizeOK', function (event) {
        event.original.preventDefault();

        // if its not a url,
        if (isUrl(url)) {
          dathubClient.metadats.query({
            url: url
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
            getPreview(url)
          })
        }
        else {
          onURLError()
          return
        }

        self.set('loading', true)
        var client = new datClient({
          url:  self.get('metadat.url'),
          user: self.get('adminUsername'),
          pass: self.get('adminPassword')
        })

        client.session(function (err, json) {
          self.set('loading', false)

          if (err) {
            self.set('authorizeError', true)
            return
          }

          self.set('authorizeError', false)
          self.set('submit', true)
        })

      })

      /** Submit **/

      self.on('submitOK', function (event) {
        // save the metadat
        var metadat = self.get('metadat')
        metadat.readme = '# ' + metadat.name + '\n\n## How can I use this dataset?'

        // alright lets do it!
        dathubClient.metadats.create(metadat, function (err, metadat) {
          if (err) {
            self.set('submitError', true)
            window.self.message('error', err)
            return
          }

          // looks like a success
          self.set('submitError', false)
          setState('finish')

          // delayed for visual confirmation
          setTimeout(function () {
            self.set('state.introText', 'Done!')
            window.location.href = '/view/' + metadat.id;
          }, 1000)
        })
        event.original.preventDefault();
      })


      /** Observers to reset error states **/

      self.observe('adminUsername adminPassword', function (newVal, old, keyPath) {
        self.set('loading', false)
        self.set('authorizeError', false)
      })

      self.observe('metadat.name metadat.description', function (newVal, old, keyPath) {
        self.set('submitError', false)
      })

      self.observe('metadat.url', function (newVal, old, keyPath) {
        beginState()
      })

      /** Stateful functions **/

      function onURLError() {
        self.set('urlError', true)
        self.set('loading', false)
      }

      function onPreviewSuccess(json) {
        self.set('metadat.status', json.status)
        self.set('metadat.name', json.name)
        self.set('metadat.description', json.description)
        self.set('metadat.publisher', json.publisher)
      }
    }
  }
}