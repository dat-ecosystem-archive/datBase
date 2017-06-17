const html = require('choo/html')
const prettyBytes = require('pretty-bytes')
const hyperdrive = require('../../components/hyperdrive')
const copyButton = require('../../components/copy-button')
const header = require('../../components/header')
const preview = require('../../components/preview')
const fourohfour = require('../../elements/404')
const error = require('../../elements/error')
const hyperdriveStats = require('../../elements/hyperdrive-stats')

var ARCHIVE_ERRORS = {
  'Invalid key': {header: 'No dat here.', body: 'Looks like the key is invalid. Are you sure it\'s correct?'},
  '/ could not be found': {header: 'Looking for sources…', icon: 'loader', body: 'Is the address correct?'},
  'timed out': {header: 'Looking for sources…', icon: 'loader', body: 'Is the address correct?'},
  'Username not found.': {header: 'That user does not exist.'},
  'Dat with that name not found.': {header: 'That user does not have a dat with that name.'},
  'too many retries': {header: 'Could not find that dat.', body: 'Is the address correct? Try refreshing your browser.'}
}

const archivePage = (state, prev, send) => {
  var err = state.archive.error
  if (!module.parent && state.archive.retries < 3) send('archive:getMetadata', {timeout: 3000})
  if (err) {
    if (err.message === 'Block not downloaded') err.message = 'timed out'
    if (!state.archive.entries.length) {
      if (state.archive.retries >= 3) err = {message: 'too many retries'}
      var props = ARCHIVE_ERRORS[err.message]
      if (props) {
        return html`
        <div>
        ${header(state, prev, send)}
        ${fourohfour(props)}
        </div>
        `
      }
    }
    if (err.message === 'timed out') {
      err.message = 'Looking for dat.json metadata...'
    }
  }
  var peers = state.archive.peers
  // var owner = (meta && state.township) && meta.username === state.township.username
  var size = state.archive.size
  var meta = state.archive.metadata
  var title = meta && meta.title || meta.shortname || state.archive.key
  var description = meta && meta.description

  // TODO: add delete button with confirm modal.
  // const deleteButton = require('../../elements/delete-button')
  // function remove () {
  //   send('archive:delete', meta.id)
  // }
  // ${owner ? deleteButton(remove) : html``}

  return html`
    <div>
      ${header(state, prev, send)}
      <div id="dat-info" class="dat-header">
        <div class="container">
          <div class="dat-header-actions-wrapper">
            ${copyButton('dat://' + state.archive.key, send)}
            <a href="/download/${state.archive.key}" target="_blank" class="dat-header-action">
              <div class="btn__icon-wrapper">
                <svg><use xlink:href="#daticon-download" /></svg>
                <span class="btn__icon-text">Download</span>
              </div>
            </a>
            </div>
          <div id="title" class="share-link">${title}</div>
          <div id="author" class="author-name">${description}</div>
          ${error(state.archive.error)}
          <div class="dat-details">
            ${size
              ? html`
                <div id="hyperdrive-size" class="dat-detail">
                  ${prettyBytes(size)}
                </div>
                `
              : ''}
            ${peers
              ? html`
                <div id="peers" class="dat-detail">
                  ${peers} Source${peers > 1 || peers === 0 ? 's' : ''}
                </div>
                `
              : ''}
          </div>
        </div>
      </div>
      <main class="site-main">
        <div class="container">
          ${hyperdrive(state, prev, send)}
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
      ${preview(state, prev, send)}
    </div>`
}

module.exports = archivePage
