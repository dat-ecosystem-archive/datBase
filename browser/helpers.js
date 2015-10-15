var Ractive = require('ractive-toolkit')
var md = require('markdown-it')()
var templateHelpers = Ractive.defaults.data

templateHelpers.prettyJSON = function (json) {
  return JSON.stringify(json, undefined, 2)
}

templateHelpers.loadingClass = function () {
  return this.get('loading') ? 'button-disabled' : ''
}

templateHelpers.loadingText = function (text) {
  return this.get('loading') ? 'Loading' : text
}

templateHelpers.markdownify = function (text) {
  return md.render(text)
}
