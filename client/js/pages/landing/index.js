const html = require('choo/html')
const header = require('./../../components/header')

const landingPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="landing-header">
        Dat is a dataset sharing system.
        <br>
        Give it a try:
      </div>
      <div class="landing-main container">

        <div class="landing-create-new-dat">
          <h3>Create New Dat</h3>
          <p>
            Drag and drop files to upload and start sharing your data
          </p>
        </div>

        <div class="landing-import-dat">
          <h3>Or Open An Existing Dat</h3>
          <input />
        </div>
      </div>
    </div>`
}

module.exports = landingPage
