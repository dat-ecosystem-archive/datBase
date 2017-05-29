const html = require('choo/html')
const panel = require('./auth/user-panel')
const importButton = require('../elements/import-button')
const loginButton = require('../components/login-button')
const message = require('../elements/message')

const header = (state, prev, send) => {
  return html`<div>
    <header class="site-header">
      ${message(state.message)}
      <div class="container container--top-bar">
        <div class="site-header__wrapper relative">
          ${panel(state, prev, send)}
          <nav class="main-nav">
            <a href="/" data-no-routing class="dat-logo">
              <img src="/public/img/dat-hexagon.svg" />
              <span class="dat-logo__word">Dat</span>
            </a>
            <a href="/explore" data-no-routing class="header-nav-link">Explore</a>
            <a href="/install" class="header-nav-link">Install</a>
            <a href="/about" class="header-nav-link">About</a>
            <a href="http://blog.datproject.org" class="header-nav-link">Blog</a>
            <a href="http://docs.datproject.org" class="header-nav-link">Docs</a>
          </nav>
          <div class="site-header__actions">
            ${importButton({
              handler: function (link) { window.location.href = '/' + link }
            })}
            ${loginButton(state, prev, send)}
          </div>
        </div>
      </div>
    </header>
  </div>`
}

module.exports = header
