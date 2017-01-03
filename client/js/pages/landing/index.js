const html = require('choo/html')
const css = require('sheetify')
const header = require('./../../components/header')

const landingPage = (state, prev, send) => {
  const prefix = css`
    :host {
      margin: auto;
      max-width: 720px;
      .center {
        text-align: center;
      }
      .create {
        margin: auto;
      }
      .row {
        margin: 10px 0px;
      }
      img {
        width: 300px;
      }

    }
  `
  return html`
    <div class="landing">
      ${header(state, prev, send)}
      <div class="${prefix}">
        <div class="example">
        </div>
        <div class="center">
          <h3>Share, version, and sync data on the distributed web.</h3>
          <div class="row">
          <p><b>Live sync</b> folders by sharing files as they are added or changed. <b>Distribute large files</b> without copying data to a central server by connecting directly to peers. <b>Intelligently sync</b> by deduplicating data between versions. <b>Verify data integrity</b> using strong cryptographic hashes.
            <a href="http://docs.datproject.org">Read More.</a></p>
          </div>
          <h5><a href="https://github.com/datproject/dat-desktop">Download the Desktop App for Mac</a></h5>
          <h5><a href="/create">Share data now</a></h5>
        </div>

        <div class="center">
          <div class="row">
            <h4><a href="https://datproject.org">About Dat</a> | <a href="https://github.com/datproject/dat">GitHub</a> | <a href="https://twitter.com/dat_project">Twitter</a> | <a href="http://tinyletter.com/datdata">Mailing List</a>
          </div>
        </div>
      </div>
    </div>`
}

module.exports = landingPage
