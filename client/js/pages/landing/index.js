const html = require('choo/html')
const css = require('sheetify')
const footer = require('../../elements/footer')
const datIcon = require('../../elements/icon')
const importButton = require('../../elements/import-button')
const homeSection = require('../../elements/home-section')
const panel = require('../../components/auth/user-panel')
const loginButton = require('../../components/login-button')
const message = require('../../elements/message')

module.exports = function (state, emit) {
  const splash = css`
    :host {
      background-repeat: no-repeat;
      background-position: center -50px;
      background-size:100%;

      @media screen and (min-width: 30em) {
        /* ns - not small breakpoint from tachyons */
        background-position: center -200px;
      }
    }
  `
  const backgroundImageUrl = '/public/img/bg-landing-page.svg'
  const hex = datIcon('hexagon-up', {class: 'color-green-disabled'})
  return html`
    <div class="home">
      <div class="absolute dt w-100">
        ${message(state.message)}
        <div class="dtc v-mid w-75 pa2 ph4-l">
          ${importButton(emit)}
        </div>
        <div class="dtc v-mid w-25 tr pa2 ph4-l">
          ${loginButton(state, emit)}
          ${panel(state, emit)}
        </div>
      </div>
      <div class="bg-neutral color-white ${splash} pb4 w-100 center" style="background-image: url(${backgroundImageUrl})">
        <section class="tc pa3 pt6">
          <h1 class="f3 f2-m f1-l fw2 mv3 tracked">
            <span class="dib grow w2 h2 hex-title-icon">
              ${hex}
            </span>datBase
          </h1>
          <h2 class="f4 fw3 color-neutral-10 mb4 lh-copy">
            Open data powered by Dat<br>
            Future-friendly apps for your research data pipeline
          </h2>
        </section>
      </div>
      ${homeSection({
        'title': 'Coming to a computer near you...',
        'subtitle': 'Built on the Dat Protocol, we imagine existing research tools enhanced with data-first infrastructure.',
        'sections': [
          {
            'title': 'Try Dat',
            'text': `
            See what it is like to use Dat!
              The Try Dat workshop will walk you through sharing and downloading data.
              It showcases unique properties of the Dat Protocol.
              <br>
              <a class="f5 b w-auto dib mt3 color-green hover-color-green-hover ba b--green pv2 ph3 link" href="http://try-dat.com">
                Try Dat Now!
              </a>
            `
          },
          {
            'title': 'Dat in the Lab',
            'text': `
              A collaboration with the California Digitial Library, funded by the Moore Foundation.
              Learn more about our pilot to integrate Dat into research data workflows.
              <br>
              <a class="f5 b w-auto dib mt3 color-green hover-color-green-hover ba b--green pv2 ph3 link" href="http://blog.datproject.org/tag/science">
                Follow on our Blog
              </a>
            `
          },
          {
            'title': 'About Dat Project',
            'text': `
              Dat is a nonprofit-backed community & open protocol for building apps of the future.
              We set out to improve access to public data and created the Dat Protocol along the way.
              <br>
              <a class="f5 b w-auto dib mt3 color-green hover-color-green-hover ba b--green pv2 ph3 link" href="http://datproject.org">
                Learn About Dat
              </a>
            `
          }
        ]
      })}
      <section class="pa3 w-100 bg-neutral-04">
        <div class="mw7 center">
          <div class="pa4-l">
            <!-- Begin MailChimp Signup Form -->
            <div id="mc_embed_signup">
              <form action="//datproject.us16.list-manage.com/subscribe/post?u=993df3c1e35c9b224b64ccf72&amp;id=128a796b8e" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="mb0 pa4 br2-ns ba b--green validate" target="_blank" novalidate>
                <div class="cf bn ma0 pa0">
                  <legend class="pa0 f5 f4-ns mb3 color-neutral-90">Get updates! Join our newsletter to receive annoucements.</legend>
                  <div>
                    <label class="clip" for="mce-EMAIL">Email Address </label>
                    <input class="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns" placeholder="Your Email Address"  type="email" value="" name="EMAIL" id="mce-EMAIL">
                  </div>
                  <div id="mce-responses" class="clear">
                    <div class="response" id="mce-error-response" style="display:none"></div>
                    <div class="response" id="mce-success-response" style="display:none"></div>
                  </div>
                  <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_993df3c1e35c9b224b64ccf72_128a796b8e" tabindex="-1" value=""></div>
                  <div class="clear">
                    <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-green hover-bg-green-hover white pointer w-100 w-25-m w-20-l br2-ns br--right-ns" >
                  </div>
                </div>
              </form>
            </div>
            <!--End mc_embed_signup-->
          </div>
        </div>
      </section>
      ${footer()}
    </div>
  `
}
