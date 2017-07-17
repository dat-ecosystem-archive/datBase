const html = require('choo/html')
const button = require('../elements/button')

module.exports = function (state, emit) {
  var meta = state.archive.metadata
  var owner = (meta && state.township) && meta.username === state.township.username
  if (!state.township.profile.admin && !owner) return html``

  return button({
    text: 'Delete',
    click: () => emit('archive:delete', {id: meta.id}),
    klass: 'btn btn--red'
  })
}
