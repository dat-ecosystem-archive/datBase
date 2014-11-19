var isUrl = require('is-url')
var debug = require('debug')('publish')

var Dat = require('./Dat.js')

module.exports =  {
  data: {},
  template: require('../templates/metadat/publish.html'),
  onrender: function () {
    var ractive = this
    var dat = null;

    ractive.set('metadat', {
      url: 'http://'
    })
    /** testing **/
    ractive.set('adminPassword', 'C0wl3v3l!')
    ractive.set('adminUsername', 'krmckelv')

    ractive.set('metadat', {
      url: 'https://dat-tweetser.herokuapp.com/'
    })

    /** end testing **/

    var states = {
      'begin': {
        'introText': 'Enter the URL for this dat.',
      },
      'preview': {
        'introText': 'Is this the dat you were looking for?'
      },
      'previewLoading': {
        'introText': 'Loading...'
      },
      'previewFailure': {
        'introText': "Hmm, that URL seems broken, try again?"
      },
      'authorize': {
        'introText': 'Okay, so it was you who set up this dat?'
      },
      'submit': {
        'introText': 'Give it a name'
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

    ractive.observe('adminUsername adminPassword', function () {
      ractive.set('loading', false)
    })

    ractive.on('authorizeSubmit', function (event) {
      ractive.set('loading', true)
      var adminUsername = ractive.get('adminUsername')
      var adminPassword = ractive.get('adminPassword')

      dat.apiSession(adminUsername, adminPassword, function (err, resp, json) {
        ractive.set('loading', false)
        if (err) {
          ractive.set('feedback', err.message)
          ractive.set('error', true)
          return
        }
        setState('submit')
      })
      event.original.preventDefault();
    })

    ractive.on('previewOK', function (event) {
      setState('authorize')
      event.original.preventDefault();
    })

    function setState(state) {
      console.log('setting state', state)
      ractive.set('feedback', null)
      ractive.set('error', false)
      ractive.set('state', states[state])
      ractive.set('state.name', state)
    }

    function getPreview(url) {
      dat = new Dat(url)
      setState('previewLoading')

      dat.api(function (err, resp, json) {
        if (err) {
          // in the case the user typed http but really meant https
          if (/^http:\/\//.test(url)) {

            //replace http with https
            url = url.replace('http://', 'https://')
            return getPreview(url)
          }

          // if that didn't work it just failed
          setState('previewFailure')
          return;
        }

        // set up the metadat with the correct data
        ractive.set('metadat.url', url)
        ractive.set('metadat.json', JSON.stringify(json, undefined, 2))
        ractive.set('metadat.name', json.name)
        ractive.set('metadat.description', json.description)
        ractive.set('metadat.publisher', json.publisher)
        setState('preview')
      })
    }

    function stateIs(name) {
     return ractive.get('state.name') == name
    }
  }
}
