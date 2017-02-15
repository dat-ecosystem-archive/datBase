var html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
    <header class="site-header site-header--external">
        <div class="container container--full">
          <div class="site-header__wrapper">
            <a href="/" class="dat-logo">
              <img src="/public/img/dat-hexagon.svg" />
              <span class="dat-logo__word">Dat</span>
            </a>
            <nav class="main-nav">
              <a href="/install" class="header-nav-link">Install</a>
              <a href="/about" class="header-nav-link">About</a>
              <a href="/blog" class="header-nav-link">Blog</a>
              <a href="/team" class="header-nav-link">Team</a>
              <a href="http://docs.datproject.org" class="header-nav-link">Docs</a>
            </nav>
          </div>
        </div>
      </header>
  `
}
