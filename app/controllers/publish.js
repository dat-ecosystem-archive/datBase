var isUrl = require('is-url')
var debug = require('debug')('publish')

var Dat = require('./Dat.js')

var STATES = {
  'begin': {
    'introText': 'Enter the URL for this dat.',
    'index': 0
  },
  'preview': {
    'introText': 'Is this the dat you were looking for?',
    'index': 1
  },
  'authorize': {
    'introText': 'Okay, so it was you who set up this dat?',
    'index': 2
  },
  'submit': {
    'introText': 'Give it a name',
    'index': 3
  },
  'finish': {
    'introText': 'Alright! Creating your dat...',
    'index': 4
  }
}

module.exports =  function (data) {

  data.visibleClass = function (state) {
    return this.get('state.name') == state ? 'visible' : 'hidden';
  }

  data.breadcrumbClass = function (bcName) {
    var currentState = this.get('state.index')
    var item = STATES[bcName].index
    if (item == currentState) {
      return 'active'
    }
    if (item < currentState) {
      return 'finished'
    }
    if (item > currentState) {
      return ''
    }
  }

  return {
    data: data,
    template: require('../templates/metadat/publish.html'),
    onrender: function () {
      var ractive = this
      var dat = null;
      var user = data.user;

      function setState(state) {
        console.log('setting state', state)
        ractive.set('state', STATES[state])
        ractive.set('state.name', state)
      }

      setState('begin')

      ractive.set('metadat', {
        url: 'https://'
      })

      /** SUBMIT **/

      ractive.on('submitOK', function (event) {
        // save the metadat
        var metadat = ractive.get('metadat')
        metadat.owner_id = user.id

        dat.save(metadat, function (err, resp, json) {
          if (err) {
            window.ractive.set('message', {
              type: 'error',
              text: err.message
            })
          }
          ractive.set('metadat.id', json.id)
          setState('finish')

          // for visual confirmation
          setTimeout(function () {
            ractive.set('state.introText', 'Done!')
            window.location.href = '/view/' + metadat.id;
          }, 2000)
        })
        event.original.preventDefault();
      })

      /** AUTHORIZE **/

      ractive.observe('adminUsername adminPassword', function (newVal, old, keyPath) {
        // when the user accidentally types in the wrong password,
        // and then tries to fix it, remove the loading and error STATES
        ractive.set('loading', false)
        ractive.set('authorizeError', false)
      })

      ractive.on('authorizeSubmit', function (event) {
        ractive.set('loading', true)
        var adminUsername = ractive.get('adminUsername')
        var adminPassword = ractive.get('adminPassword')

        dat.apiSession(adminUsername, adminPassword, function (err, resp, json) {
          ractive.set('loading', false)

          if (err) {
            ractive.set('authorizeError', true)
            return
          }

          ractive.set('authorizeError', false)
          setState('submit')
        })
        event.original.preventDefault();
      })

      /** PREVIEW **/

      ractive.observe('metadat.url', function (newVal, old, keyPath) {
        resetState()
      })

      // ok buttong on preview
      ractive.on('previewOK', function (event) {
        // preview is currently visible
        if (successfulPreview()) {
          return setState('authorize')
        }

        // url needs to be checked/previewed
        var url = ractive.get('metadat.url')

        if (!/^http/.test(url)) {
          url = 'http://' + url
        }

        if (isUrl(url)) {
          getPreview(url)
        }
        else {
          onPreviewError();
          return
        }
        event.original.preventDefault();
      })

      function getPreview(url) {
        dat = new Dat(url)
        ractive.set('loading', true)

        dat.api(function (err, resp, json) {
          ractive.set('loading', false)
          if (err) {
            // attempt url sanitizing
            if (/^http:\/\//.test(url)) {
              //replace http with https
              url = url.replace('http://', 'https://')
              return getPreview(url)
            }

            // if that didn't work it just failed
            onPreviewError();
            return;
          }
          ractive.set('urlError', false)

          // set up the metadat with the correct data
          ractive.set('metadat.url', url)
          ractive.set('metadat.json', json)
          ractive.set('metadat.name', json.name)
          ractive.set('metadat.description', json.description)
          ractive.set('metadat.publisher', json.publisher)
          setState('preview')
        })
      }

      function successfulPreview() {
        var json = ractive.get('metadat.json')
        var success = json != null && json != undefined
        console.log('success', success)
        return success
      }

      function onPreviewError() {
        setState('begin')
        ractive.set('urlError', true)
        ractive.set('metadat.json', null)
        ractive.set('adminPassword', null)
        ractive.set('adminUsername', null)
      }

      function resetState() {
        ractive.set('loading', false)
        ractive.set('urlError', false)
        ractive.set('metadat.json', null)
        setState('begin')
      }
    }

  }
}