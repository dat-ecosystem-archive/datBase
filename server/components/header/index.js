const html = require('choo/html')
var button = require('dat-button')
var importButton = () => 'import button'
var help = () => 'help'

const header = (state, prev) => {
  return html`<header class="site-header">
    <div class="container">
      <a href="http://dat-data.com" class="dat-logo">
        <img src="./public/img/dat-data-logo.svg" />
      </a>
      <div class="site-header__actions">
        <div class="dat-button dat-button--new-dat">
          ${button({
            text: 'Create new Dat'
          })}
        </div>
        ${importButton({
          download: 'zzz'
        })}
        ${help()}
      </div>
    </div>
  </header>`
}

module.exports = header
