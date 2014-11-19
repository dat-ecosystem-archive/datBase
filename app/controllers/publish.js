var path = require('path')
var isUrl = require('is-url')
var debug = require('debug')('publish')

module.exports =  {
  data: {},
  template: require('../templates/metadat/publish.html'),
  onrender: function () {
    var ractive = this

    ractive.set('metadat', {
      url: 'http://'
    })

    var states = {
      'begin': {
        'introText': 'Enter the URL for this dat.',
      },
      'preview': {
        'introText': 'Is this the dat you were looking for?',
        'next': 'authorize'
      },
      'previewLoading': {
        'introText': 'Loading...'
      },
      'previewFailure': {
        'introText': "Hmm, that URL seems broken, try again?"
      },
      'authorize': {
        'introText': 'Okay, so it was you who set up this dat?',
        'next': ''
      }
    }
    setState('begin')

    var typing = false;

    ractive.observe('metadat.url', function (url, oldValue, keyPath) {
      if (isUrl(url)) {
        getPreview(url)
      } else {
        setState('begin')
      }
    })

    ractive.on('nextState', function (event) {
      setState(ractive.get('state.next'))
    })

    function setState(state) {
      console.log('setting state', state)
      ractive.set('state', states[state])
      ractive.set('state.name', state)
    }

    function getPreview(url) {
      var dat = new Dat(url)
      dat.get_api(function (err, data) {
        if (err) {
          // in the case the user typed http but really meant https
          if (/^http:\/\//.test(url)) {
            url = url.replace('http://', 'https://')
            console.log('trying again', url)
            return getPreview(url)
          }
          setState('previewFailure')
          return;
        }
        ractive.set('metadat.url', url)
        ractive.set('metadat.json', JSON.stringify(data, undefined, 2))
        ractive.set('metadat.name', data.name)
        ractive.set('metadat.description', data.description)
        ractive.set('metadat.publisher', data.publisher)
        ractive.set('loading', false)
        setState('preview')
      })
    }

    function stateIs(name) {
     return ractive.get('state.name') == name
    }

    /** I am a Dat **/
    function Dat(url) {
      this.url = url
    };

    Dat.prototype.get_api = function(cb) {
      var self = this

      var apiUrl = path.join(self.url, '/api')

      ractive.set('loading', true)
      setState('previewLoading')
      console.log('grabbing', apiUrl)

      $.getJSON(apiUrl, function (data) {
        cb(null, data)
      }).fail(function () {
        cb('bad!')
      })
    }

  }
}