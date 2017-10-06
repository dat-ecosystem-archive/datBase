
module.exports = function (state, emitter) {
  var ga = null

  emitter.on(state.events.DOMCONTENTLOADED, trackView)
  emitter.on(state.events.NAVIGATE, trackView)

  function trackView () {
    const GAnalytics = require('ganalytics')
    if (!ga) ga = new GAnalytics('UA-49664853-1', { aid: 1, an: 'datbase' })
    ga.send('pageview')
  }
}
