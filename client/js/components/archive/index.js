const html = require('choo/html')

const archive = (state, prev, send) => {
  return html`<div>
      <h3>Client-rendered properties:</h3>
      <ul>
      <li>location: ${state.location.pathname}</li>
      <li>TODO: "rehydrate" me with metadata from server, look for webrtc peers</li>
      </ul>
      </div>`
}

module.exports = archive
