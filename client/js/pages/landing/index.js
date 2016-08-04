const html = require('choo/html')
const header = require('./../../components/header')

const homePage = (state, prev) => {
  return html`<html>
    <head>
      <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
      <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
    </head>
    <body>
      ${header(state, prev)}
      <div class="tmp-home-view">
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
      </div>
    </body></html>`
}

module.exports = homePage
