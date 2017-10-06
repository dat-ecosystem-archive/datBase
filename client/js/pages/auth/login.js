const html = require('choo/html')
const header = require('./../../components/header')
const login = require('./../../components/auth/login')

module.exports = (state, emit) => {
  emit(state.events.DOMTITLECHANGE, 'Login | datBase')
  return html`
    <div class="landing">
      ${header(state, emit)}
      ${login(state, emit)}
    </div>`
}
