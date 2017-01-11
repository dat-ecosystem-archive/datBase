const html = require('choo/html')
const panel = require('./auth/user-panel')
const login = require('./auth/login')
const button = require('../elements/button')
const importButton = require('../elements/import-button')
const message = require('../elements/message')

const header = (state, prev, send) => {
  return html`<div>
    ${panel(state, prev, send)}
    ${login(state, prev, send)}
    <header class="site-header"><div id="intro"></div>
      ${message(state.message)}
      <div class="container container--site-header">
        <a href="/" class="dat-logo">
          <img src="/public/img/dat-hexagon.svg" />
          <div>dat</div>
        </a>
        <div class="site-header__actions">
        ${button({
          icon: '/public/img/create-new-dat.svg',
          text: 'Create new Dat',
          klass: 'btn btn--green new-dat',
          click: function () { window.location.href = '/create' }
        })}
          ${importButton({
            handler: function (link) { window.location.href = '/view/' + link }
          })}
        </div>
      </div>
    </header>
  </div>`
}

module.exports = header
