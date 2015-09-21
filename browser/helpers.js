var Ractive = require('ractive')
var md = require('markdown-it')()
var templateHelpers = Ractive.defaults.data
var prettyBytes = require('pretty-bytes')
var relativeDate = require('relative-date')

templateHelpers.prettyJSON = function (json) {
  return JSON.stringify(json, undefined, 2);
}

templateHelpers.errorClass = function (state) {
  return this.get(state) ? 'has-error' : '';
}

templateHelpers.loadingClass = function() {
  return this.get('loading') ? 'button-disabled' : '';
}

templateHelpers.loadingText = function (text) {
  return this.get('loading') ? 'Loading' : text
}

templateHelpers.markdownify = function (text) {
  return md.render(text)
}

templateHelpers.prettyBytes = function (bytes) {
  return prettyBytes(bytes)
}

templateHelpers.relativeDate = function (iso) {
  return relativeDate(new Date(iso))
}
