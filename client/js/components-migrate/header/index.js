var yo = require('yo-yo')
var importButton = require('dat-header/import')
var help = require('../help')
var button = require('dat-button')

module.exports = Header

function Header (el, props) {
  if (!(this instanceof Header)) return new Header(el, props)
  this.$el = document.getElementById(el)
  this._props = props
  this._component = this._render()
  if (this.$el) this.$el.appendChild(this._component)
}

Header.prototype.update = function (state) {
  if (state && state.archiveReducer) {
    yo.update(this._component, this._render())
  }
}

Header.prototype._render = function () {
  return yo`
    <header class="site-header">
      <div class="container container--site-header">
        <a href="http://dat-data.com" class="dat-logo">
          <img src="./public/img/dat-data-logo.svg" style="width:40px;" />
        </a>
        <div class="site-header__actions">
          <div class="dat-button dat-button--new-dat">
            ${button({
              text: 'Create new Dat',
              click: this._props.create
            })}
          </div>
          ${importButton({
            download: this._props.download
          })}
          ${help()}
        </div>
      </div>
    </header>
  `
}
