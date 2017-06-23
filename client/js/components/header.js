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
    display: flex;
    height: var(--site-header-height);
    align-items: center;
  }
`

const header = (state, emit) => {
  return html`<div>
    <header class="relative ${headerStyles}">
      ${message(state.message)}
      <div class="container container--top-bar">
        <div class="flex justify-between items-center relative">
          ${panel(state, emit)}
          <nav class="flex items-center ${navStyles}">
            <a href="/" data-no-routing class="dat-logo">
              <img src="/public/img/dat-hexagon.svg" />
              <span class="dat-logo__word">Dat</span>
            </a>
            ${importButton(emit)}
            <a href="/explore" data-no-routing class="header-nav-link">Explore</a>
            <a href="/install" class="header-nav-link">Install</a>
          </nav>
          <div>
            ${state.township.email ? html`<a href="/publish" class="btn btn--green">Publish</a>` : ''}
            ${loginButton(state, emit)}
          </div>
        </div>
      </div>
    </header>
  </div>`
}

module.exports = header
