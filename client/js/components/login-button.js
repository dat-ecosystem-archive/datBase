const html = require('choo/html')
const css = require('sheetify')
const button = require('../elements/button')
const gravatar = require('../elements/gravatar')

var avatarStyles = css`
  :host {
    display: block;
    width: 2.25em;
    height: 2.25em;
    vertical-align: middle;
    border-radius: 50%;
    border: 2px solid var(--color-neutral-20);
    background-color: var(--color-pink);
    margin: auto;
    &:hover, &:focus {
      border-color: var(--color-white);
    }
  }
`

module.exports = function (state, prev, send) {
  return html``
  if (state.township.email) {
    return html`
      ${button({
        text: gravatar({email: state.township.email}, '', avatarStyles),
        click: () => send('township:sidePanel'),
        klass: `btn bn`
      })}
    `
  } else {
    return html`
      ${button({
        text: 'Login',
        click: function () { window.location.href = '/login' },
        klass: 'btn btn--full btn--green'
      })}
    `
  }
}
