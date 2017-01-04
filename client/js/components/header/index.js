const html = require('choo/html')
const panel = require('./../../components/auth/user-panel')
const login = require('./../../components/auth/login')
const loginButton = require('./../../components/login-button')
const button = require('./../../elements/button')
const importButton = require('./../../elements/import-button')
const message = require('./../../elements/message')

const help = (state, prev, send) => {
  if (module.parent || window.location.pathname === '/') return ''
  const intro = () => send('help:show')
  return html`
    ${button({
      icon: '/public/img/question.svg',
      text: 'Help',
      klass: 'btn btn--green btn__reveal-text dat-button--help',
      click: intro
    })}
    `
}

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
          ${loginButton(state, prev, send)}
          ${help(state, prev, send)}
        </div>
      </div>
    </header>
  </div>`
}

module.exports = header
