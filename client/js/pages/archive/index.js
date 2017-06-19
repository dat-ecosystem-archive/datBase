const html = require('choo/html')
const hyperdrive = require('../../components/hyperdrive')
const hyperhealth = require('../../components/health')
const copyButton = require('../../components/copy-button')
const header = require('../../components/header')
const preview = require('../../components/preview')
const fourohfour = require('../../elements/404')
const error = require('../../elements/error')
const hyperdriveStats = require('../../elements/hyperdrive-stats')
const css = require('sheetify')

var ARCHIVE_ERRORS = {
  'Invalid key': {header: 'No dat here.', body: 'Looks like the key is invalid. Are you sure it\'s correct?'},
  '/ could not be found': {header: 'Looking for sources…', icon: 'loader', body: 'Is the address correct?'},
  'timed out': {header: 'Looking for sources…', icon: 'loader', body: 'Is the address correct?'},
  'Username not found.': {header: 'That user does not exist.'},
  'Dat with that name not found.': {header: 'That user does not have a dat with that name.'},
  'too many retries': {header: 'Could not find that dat.', body: 'Is the address correct? Try refreshing your browser.'}
}

const archivePage = (state, emit) => {
  var err = state.archive.error
  if (!module.parent && state.archive.retries < 3) emit('archive:getMetadata', {timeout: 3000})
  if (err) {
    if (err.message === 'Block not downloaded') err.message = 'timed out'
    if (!state.archive.entries.length) {
      if (state.archive.retries >= 3) err = {message: 'too many retries'}
      var props = ARCHIVE_ERRORS[err.message]
      if (props) {
        return html`
        <div>
        ${header(state, emit)}
        ${fourohfour(props)}
        </div>
        `
      }
    }
    if (err.message === 'timed out') {
      err.message = 'Looking for dat.json metadata...'
    }
  }
  // var owner = (meta && state.township) && meta.username === state.township.username
  var meta = state.archive.metadata
  var title = meta && meta.title || meta.shortname || state.archive.key
  var description = meta && meta.description
  var styles = css`
    .dat-header {
      padding-top: 1.25rem;
      padding-bottom: .75rem;
      border-bottom: 1px solid $color-neutral-10;
      background-color: $color-neutral-04;
      font-size: .8125rem;
    }

    .dat-header-actions-wrapper {
      @media only screen and (min-width: $md1) {
        float: right;
        margin-left: 2rem;
      }
    }

    .dat-header-action {
      display: inline-block;
      margin-left: 1rem;
      padding-top: .4rem;
      border: 0;
      font-size: .875rem;
      line-height: 1.25;
      background-color: transparent;
      color: $color-neutral-80;
      &:not([disabled]):hover, &:not([disabled]):focus {
        color: $color-neutral;
      }
      &:first-child {
        margin-left: 0;
        padding-left: 0;
      }
      &:disabled {
        opacity: 0.5;
      }
      svg,
      .btn__icon-img {
        width: 1rem;
        max-width: 1.25rem;
        max-height: 1rem;
      }
    }

    .share-link {
      display: flex;
      font-size: 1.375rem;
    }
  `

  // TODO: add delete button with confirm modal.
  // const deleteButton = require('../../elements/delete-button')
  // function remove () {
  //   emit('archive:delete', meta.id)
  // }
  // ${owner ? deleteButton(remove) : html``}

  return html`
    <div class="${styles}">
      ${header(state, emit)}
      <div id="dat-info" class="dat-header">
        <div class="container">
          <div class="dat-header-actions-wrapper">
            ${copyButton('dat://' + state.archive.key, emit)}
            <a href="/download/${state.archive.key}" target="_blank" class="dat-header-action">
              <div class="btn__icon-wrapper">
                <svg><use xlink:href="#daticon-download" /></svg>
                <span class="btn__icon-text">Download</span>
              </div>
            </a>
            </div>
          <div id="title" class="share-link">${title}</div>
          <div id="author" class="author-name">${description || 'No description.'}</div>
          <div id="link" class="author-name">dat://${state.archive.key}</div>
          ${hyperhealth(state, emit)}
          ${error(state.archive.error)}
        </div>
      </div>
      <main class="site-main">
        <div class="container">
          ${hyperdrive(state, emit)}
        </div>
      </main>
      <div class="status-bar">
        <div class="container">
          <span id="help-text" class="status-bar-status"></span>
          ${(state.archive.downloadTotal || state.archive.uploadTotal)
            ? html`<div id="hyperdrive-stats" class="status-bar-stats">
                Total: ${hyperdriveStats({ downloaded: state.archive.downloadTotal, uploaded: state.archive.uploadTotal })}
              </div>`
            : ''}
        </div>
      </div>
      ${preview(state, emit)}
    </div>`
}

module.exports = archivePage
