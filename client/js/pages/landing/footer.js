var html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-xs-6 col-sm-4">
          <h4 class="footer-heading horizontal-rule-footer">Explore</h4>
          <ul class="footer-nav-list">
            <li><a href="/team">Team</a></li>
            <li><a href="https://www.stickermule.com/en/marketplace/9709-dat-data-v3">Get Stickers</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div class="col-xs-6 col-sm-4">
          <h4 class="footer-heading horizontal-rule-footer">Learn</h4>
          <ul class="footer-nav-list">
            <li><a href="/about">About</a></li>
            <li><a href="http://docs.datproject.org">Docs</a></li>
          </ul>
        </div>
        <div class="col-xs-6 col-sm-4">
          <h4 class="footer-heading horizontal-rule-footer">Connect</h4>
          <ul class="footer-nav-list">
            <li><a href="https://twitter.com/dat_project">Twitter</a></li>
            <li><a href="https://github.com/datproject/dat">GitHub</a></li>
            <li>
              <a href="https://tinyletter.com/datdata" target="_blank">Newsletter </a>
            </li>
          </ul>
        </div>
      </div>
      <p class="footer-credits">
        <strong>Dat</strong> 2017 &bull; Page source on <a href="https://github.com/datproject/website">github</a>
      </p>
    </div>
  </footer>
  `
}
