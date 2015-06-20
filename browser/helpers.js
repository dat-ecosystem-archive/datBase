var Ractive = require('ractive');
var md = require('markdown-it')()
var templateHelpers = Ractive.defaults.data

templateHelpers.prettyJSON = function (json) {
  return JSON.stringify(json, undefined, 2);
}

templateHelpers.errorClass = function (state) {
  return this.get(state) ? 'has-error' : '';
}

templateHelpers.loadingClass = function() {
  return this.get('loading') ? 'btn-disabled' : 'btn-success';
}

templateHelpers.loadingText = function (text) {
  return this.get('loading') ? 'Loading' : text
}

templateHelpers.markdownify = function (text) {
  return md.render(text)
}

