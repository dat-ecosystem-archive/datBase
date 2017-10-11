const html = require('choo/html')
const css = require('sheetify')

module.exports = function () {
  return html`
  <footer class="pv2 bg-neutral white w-100">
    <section class="ph2 ph4-m mw8-ns center-ns">
      <div class="pt3">
        <div class="mb2 lh-copy">
          <a class="f4 b white dib dim link hover-color-white mr3 mt1" href="/" title="Dat Project">
            <img src="/public/img/dat-hexagon.svg" class="dib w2 h2 mr2 v-mid mb1" alt="Dat Project">
            datBase
          </a>
          <a class="f4 link white hover-color-neutral-40 b dib mr3 mb3" href="http://blog.datproject.org" title="Blog - Dat Project">
            Blog
          </a>
        </div>
        <div class="mt3">
          <a class="white hover-color-white ba b--green no-underline grow b inline-flex items-center mr3 mb3 pv2 ph3" href="https://datproject.org" title="Dat Project Home">
            <div class="color-green dib mr2"><svg class="w2 h2"><use xlink:href="#daticon-happy-dat"/></svg></div>
            <span>Dat Project Home</span>
          </a>
          <a class="white hover-color-white ba b--green no-underline grow b inline-flex items-center mr3 mb3 pv2 ph3" href="http://chat.datproject.org" title="Join our Chat">
            <div class="color-green dib mr2"><svg class="w2 h2"><use xlink:href="#daticon-question"/></svg></div>
            <span>
              Curious? Join Our Chat
            </span>
          </a>
          <a class="white hover-color-white ba b--green no-underline grow b inline-flex items-center mb3 pv2 ph3" href="https://donate.datproject.org" title="Donate to Code for Science & Society">
            <div class="color-green dib mr2"><svg class="w2 h2"><use xlink:href="#daticon-star-dat"/></svg></div>
            <span>Donate to Support Public Data</span>
          </a>
        </div>
        <p class="f6 measure copy lh-copy">
          Have questions? Join our chat or ask on <a href="http://twitter.com/dat_project" class="color-blue no-underline underline-hover">Twitter</a> or <a href="http://github.com/datproject" class="color-pink no-underline underline-hover color-green">Github</a>.
        </p>
      </div>
      <p class="bt b--dat-neutral-80 color-neutral-50 tc f7 pv2">
        <strong>Dat</strong> 2017 • Page source on <a class="color-neutral-50 hover-color-pink" href="https://github.com/datproject/datbase.org">github</a>
      </p>
    </section>
  </footer>
  `
}
