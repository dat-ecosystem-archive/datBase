const html = require('choo/html')
const css = require('sheetify')
const panel = require('./auth/user-panel')
const importButton = require('../elements/import-button')
const loginButton = require('../components/login-button')
const message = require('../elements/message')

var headerStyles = css`
 :host {
   height: var(--site-header-height);
   background-color: var(--color-white);
   border-bottom: 1px solid var(--color-neutral-10);
 }
`

var navStyles = css`
  :host {
    height: var(--site-header-height);
  }
`

const header = (state, prev, send) => {
  return html`<div>
    <header class="relative ${headerStyles}">
      ${message(state.message)}
      <div class="container container--top-bar">
        <div class="flex items-center justify-between relative">
          ${panel(state, prev, send)}
          <nav class="flex ${navStyles}">
            <a href="/" data-no-routing class="dat-logo">
              <img src="/public/img/dat-hexagon.svg" />
              <span class="dat-logo__word">Dat</span>
            </a>
            <a href="/explore" data-no-routing class="header-nav-link">Explore</a>
            <a href="/install" class="header-nav-link">Install</a>
            <a href="/about" class="header-nav-link hidden-on-mobile">About</a>
            <a href="http://blog.datproject.org" class="header-nav-link hidden-on-mobile">Blog</a>
            <a href="http://docs.datproject.org" class="header-nav-link hidden-on-mobile">Docs</a>
          </nav>
          <div class="site-header__actions">
            ${importButton({
              handler: function (link) { send('archive:view', link) }
            })}
            ${loginButton(state, prev, send)}
          </div>
        </div>
      </div>
    </header>
  </div>`
}

module.exports = header
