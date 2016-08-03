const html = require('choo/html')
const button = require('dat-button')
const importButton = require('dat-header/import')

const help = () => {
  const intro = () => window.alert('not yet')
  return html`<div class="dat-button">${button({text: '?', click: intro})}</div>`
}

const header = (state, prev, send) => {
  return html`<header class="site-header">
    <div class="container">
      <a href="http://dat-data.com" class="dat-logo">
        <img src="./public/img/dat-data-logo.svg" />
      </a>
      <div class="site-header__actions">
        <div class="dat-button dat-button--new-dat">
          ${button({
            text: 'Create new Dat',
            click: () => send('archive:new')
          })}
        </div>
        ${importButton({
          download: (link) => send('archive:load', link)
        })}
        ${help()}
      </div>
    </div>
  </header>`
}

module.exports = header
