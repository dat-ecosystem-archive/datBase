var isUrl = require('is-url')
var debug = require('debug')('publish')

var dathubClient = require('../hub')
var datClient = require('dat-api-client')

/**
 * A state in our publish flow.
 * Params
 * ------
 * introText: string
 *  What the user will see when in this state.
 * index: int
 *  The index determines breadcrumb level.
 *  1-preview, 2- authorize, 3-submit, 4-all finished
 */
var STATES = {
  'begin': {
    'introText': 'Enter the URL for this dat.',
    'index': 1
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

  // TODO: pull breadcrumbs out
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

  /* Return the ractive object to be rendered */
  return {
    data: data,
    template: require('../templates/metadat/publish.html'),
    onrender: function () {
      var ractive = this
      var dat = null;
      var user = data.user;

      function setState(state) {
        debug('setting state', state)
        ractive.set('state', STATES[state])
        ractive.set('state.name', state)
      }

      beginState()

      ractive.set('metadat', {
        url: 'https://',
        owner_id: user.handle
      })

      /** Preview **/

      ractive.on('previewOK', function (event) {
        if (previewVisible()) {
          return setState('authorize')
        }

        // url needs to be checked
        var url = ractive.get('metadat.url')

        // if it doesnt have http://, add it.
        if (!/^http/.test(url)) {
          url = 'http://' + url
        }

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
                ractive.set('existingDat', json)
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
        event.original.preventDefault()
      })

      /* Get the metadat preview
       * TODO: it might be nice to move this to the metadat object.
       */
      function getPreview(url) {
        ractive.set('loading', true)

        var client = new datClient({
          url: url
        })
        // call the dat
        client.info(function (err, resp, json) {
          ractive.set('loading', false)
          if (err) {
            console.error(err.message)
            // maybe they don't know its https? replace http with https
            if (/^http:\/\//.test(url)) {
              url = url.replace('http://', 'https://')
              return getPreview(url)
            }

            // if that didn't work it just failed. go back to beginning.
            beginState();
            onURLError();
            return;
          }

          // set up the metadat with the correct url
          ractive.set('metadat.url', url)
          onPreviewSuccess(json)
        })
      }

      /** Authorize **/

      ractive.on('authorizeOK', function (event) {
        ractive.set('loading', true)
        var client = new datClient({
          url:  ractive.get('metadat.url'),
          user: ractive.get('adminUsername'),
          pass: ractive.get('adminPassword')
        })

        client.session(function (err, resp, json) {
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

      /** Submit **/

      ractive.on('submitOK', function (event) {
        // save the metadat
        var metadat = ractive.get('metadat')
        metadat.readme = '# ' + metadat.name + '\n\n## How can I use this dataset?'

        // alright lets do it!
        dathubClient.metadats.create(metadat, function (err, metadat) {
          if (err) {
            ractive.set('submitError', true)
            window.ractive.message('error', err)
            return
          }

          // looks like a success
          ractive.set('submitError', false)
          setState('finish')

          // delayed for visual confirmation
          setTimeout(function () {
            ractive.set('state.introText', 'Done!')
            window.location.href = '/view/' + metadat.id;
          }, 1000)
        })
        event.original.preventDefault();
      })


      /** Observers to reset error states **/

      ractive.observe('adminUsername adminPassword', function (newVal, old, keyPath) {
        ractive.set('loading', false)
        ractive.set('authorizeError', false)
      })

      ractive.observe('metadat.name metadat.description', function (newVal, old, keyPath) {
        ractive.set('submitError', false)
      })

      ractive.observe('metadat.url', function (newVal, old, keyPath) {
        beginState()
      })

      /** Stateful functions **/

      function onURLError() {
        ractive.set('urlError', true)
        ractive.set('loading', false)
      }

      function previewVisible() {
        var json = ractive.get('metadat.json')
        return json != null && json != undefined
      }

      function onPreviewSuccess(json) {
        ractive.set('metadat.json', json)
        ractive.set('metadat.name', json.name)
        ractive.set('metadat.description', json.description)
        ractive.set('metadat.publisher', json.publisher)
        setState('preview')
      }

      function beginState() {
        ractive.set('loading', false)
        ractive.set('urlError', false)
        ractive.set('authorizeError', false)
        ractive.set('adminPassword', null)
        ractive.set('adminUsername', null)
        ractive.set('metadat.json', null)
        ractive.set('existingDat', null)
        setState('begin')
      }
    }

  }
}