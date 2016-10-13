const html = require('choo/html')
const button = require('./../../elements/button')
const loginButton = require('../login-button')
const importButton = require('./../../elements/import-button')

const help = (state, prev, send) => {
  if (module.parent || window.location.pathname === '/') return ''
  const intro = () => send('help:show')
  return html`<div class="dat-button dat-button--help">
    ${button({
      icon: './public/img/question.svg',
      text: 'Help',
      klass: 'btn btn--green btn__reveal-text',
      click: intro
    })}
  </div>`
}

const header = (state, prev, send) => {
  return html`<header class="site-header"><div id="intro"></div>
    <div class="container container--site-header">
      <a href="/" class="dat-logo">
        <img src="./public/img/dat-hexagon.svg" />
        <div>dat<span>.</span>land</div>
      </a>
      <div class="site-header__actions">
        <div id="js-button-new" class="dat-button dat-button--new-dat">
          ${button({
            icon: './public/img/create-new-dat.svg',
            text: 'Create New Dat',
            klass: 'btn btn--green',
            click: () => send('archive:new')
          })}
        </div>
        ${importButton({
          handler: function (link) { window.location.href = '/' + link }
        })}
        ${loginButton({
          user: state.user
        }, prev, send)}
        ${help(state, prev, send)}
      </div>
    </div>
  </header>`
}

module.exports = header
