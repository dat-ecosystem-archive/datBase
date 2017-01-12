const html = require('choo/html')
const panel = require('./auth/user-panel')
const login = require('./auth/login')
const loginButton = require('./login-button')
const button = require('../elements/button')
const importButton = require('../elements/import-button')
const message = require('../elements/message')

const header = (state, prev, send) => {
  return html`<div>
    ${panel(state, prev, send)}
    ${login(state, prev, send)}
    <header class="site-header">
      ${message(state.message)}
      <div class="container container--site-header">
        <a href="/" class="dat-logo">
          <img src="/public/img/dat-hexagon.svg" />
          <div>Dat</div>
        </a>
        <div class="site-header__actions">
          ${importButton({
            handler: function (link) { window.location.href = '/view/' + link }
          })}
          ${button({
            icon: '/public/img/create-new-dat.svg',
            text: 'Create new Dat',
            klass: 'btn btn--green new-dat',
            click: function () { window.location.href = '/create' }
          })}
          ${loginButton(state, prev, send)}
        </div>
      </div>
    </header>
  </div>`
}

module.exports = header
