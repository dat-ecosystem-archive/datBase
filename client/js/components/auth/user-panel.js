const css = require('sheetify')
const html = require('choo/html')

const prefix = css`
  :host {
    position: absolute;
    right: 0;
    top: 3.75rem;
    z-index: 100;
    min-width: 18rem;
    padding: 1rem;
    background-color: var(--color-white);
    color: var(--color-neutral-80);
    box-shadow: 0 0 .75rem rgba(0,0,0,.25);
    .gravatar {
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      display: block;
      margin: 0 .5rem 0 0;
      border: 2px solid var(--color-neutral-04);
    }

    .content {
      margin-top: .5rem;
      margin-bottom: .5rem;
      padding-top: .5rem;
      padding-bottom: .5rem;
      border-top: 1px solid var(--color-neutral-10);
      border-bottom: 1px solid var(--color-neutral-10);
    }
    .close-button {
      position: absolute;
      right: .5rem;
      top: .5rem;
      display: block;
      overflow: hidden;
      color: var(--color-neutral-20);
      &:hover, &:focus {
        color: var(--color-neutral-40);
      }
      svg {
        fill: currentColor;
        max-width: 1.5rem;
        max-height: 1.5rem;
      }
    }
    ul {
      padding-left: 0;
      border-top: 1px solid var(--color-neutral-20);
      a {
        display: block;
        color: var(--color-neutral-60);
        &:hover, &:focus {
          color: var(--color-neutral-80);
        }
      }
      li {
        margin-top: .5rem;
        margin-bottom: .5rem;
      }
      &:hover, &:focus {
        .delete-btn {
          visibility: visible;
        }
      }
      svg {
        fill: currentColor;
        max-width: 1rem;
        max-height: 1.5rem;
      }
    }

  }
`

module.exports = function (state, emit) {
  if (!state.township.username) return

  return html`<div class="user-panel tl mr2 mr4-l ${prefix} ${state.township.sidePanel}">
      <a class="close-button" title="Close" href="#" onclick=${() => emit('township:sidePanel')}>
        <svg>
          <use xlink:href="#daticon-cross" />
        </svg>
      </a>
      <div class="flex items-center mb2">
        <div>
          Signed in as <b>${state.township.profile.username}</b>
        </div>
      </div>
      <ul class="list mb0">
        <li><a href="/${state.township.username}" data-no-routing>View Profile</a></li>
        <li><a href="/profile/edit" data-no-routing>Edit Profile</a></li>
        <li><a href="http://github.com/datproject/datbase/issues" target="_blank" class="color-neutral-50 hover-color-neutral-70">Report Bug</a></li>
        <li class="mb0"><a href="#" onclick=${() => emit('township:logout', {})}>Logout</a></li>
      </ul>
  </div>`
}
