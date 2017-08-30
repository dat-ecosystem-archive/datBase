const html = require('choo/html')
const css = require('sheetify')
const footer = require('../../elements/footer')
const datIcon = require('../../elements/icon')
const homeSection = require('../../elements/home-section')
const panel = require('../../components/auth/user-panel')
const loginButton = require('../../components/login-button')
const message = require('../../elements/message')

module.exports = function (state, emit) {
  const splash = css`
    :host {
      background-repeat: repeat-y;
      background-position: center -75px;

      @media screen and (min-width: 30em) {
        /* ns - not small breakpoint from tachyons */
        background-position: center -175px;
      }
    }
  `
  const backgroundImageUrl = '/public/img/bg-landing-page.svg'
  const star = datIcon('star-dat', {class: 'color-green'})
  return html`
    <div class="min-vh-100 pb7">
      <div class="absolute w-100">
        ${message(state.message)}
        <div class="tr pa2 ph4-l">
          ${loginButton(state, emit)}
          ${panel(state, emit)}
        </div>
      </div>
      <div class="${splash} pb6-ns pb4 w-100 center" style="background-image: url(${backgroundImageUrl})">
        <section class="tc pa3 pt5-ns">
          <h1 class="f3 f2-m f1-l fw2 black-90 mv3 tracked">
            Dat<span class="v-mid dib grow w2 h2">
              ${star}
            </span>Base
          </h1>
          <h2 class="f5 fw2 color-neutral-60 mb4 lh-copy">
            Search for data preprints on DatBase!
          </h2>
          <div class="w-90 w-50-l center">
            ${search()}
          </div>
        </section>
        <section class="bg-white mt4 mt3-ns mw7-ns center pa3 ph5-ns">
          <p class="f4 lh-copy measure-wide">
            Research papers are becoming increasingly accessible through open access and preprint servers.
            Research data is still behind locked custom APIs, confusing interfaces, or slow HTTP servers.
            We dream of world when all this data can be accessed as easy as the web.
            <a href="#"> Imagine with us</a>.
          </p>
          <p class="f3 lh-copy measure-wide">
            DatBase is distributed preprints for data!
            Built by <a href="http://datproject.org">Dat Project</a>.
          </p>
        </section>
      </div>
      <section class="pa3 w-100 bg-neutral-04">
        <div class="mw7 center">
          <div class="pa4-l">
            <form class="mb0 pa4 br2-ns ba b--green">
              <fieldset class="cf bn ma0 pa0">
                <legend class="pa0 f5 f4-ns mb3 black-80">Get updates! We promise to only send the very exciting stuff.</legend>
                <div class="cf">
                  <label class="clip" for="email-address">Email Address</label>
                  <input class="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns" placeholder="Your Email Address" type="text" name="email-address" value="" id="email-address">
                  <input class="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns" type="submit" value="Subscribe">
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </section>
      ${homeSection({
        'title': 'What are Data Preprints?',
        'subtitle': 'With data preprints you can make data public & shareable before you are ready to publish.',
        'sections': [
          {
            'title': 'User Friendly',
            'text': `
              Dat's simple to use command line tool works alognside apps like Dropbox or Google Drive.
              Keep data private until you are ready to prepublish without changing your data management software.
            `
          },
          {
            'title': 'Reproducible History',
            'text': `
              Dat uses cryptographic registers to certify data ownership and track changes over time.
              A history of changes improves data reproducibility and transparency.
            `
          },
          {
            'title': 'One-Click Publish',
            'text': `
              In the future, DatBase will have one-click publishing to data repositories such as Zenodo or Dataverse.
              Dat's innovative storage makes it the perfect intermediate between files on your computer and data publishing sites.
            `
          }
        ],
        'cta': {
          'link': 'http://datproject.org',
          'text': 'Learn more about Dat Project'
        }
      })}
      ${footer()}
    </div>
  `

  function search () {
    const keydown = (e) => {
      if (e.keyCode === 13) {
        var link = e.target.value
        e.target.value = ''
        emit('archive:view', link)
      }
    }

    const searchIcon = datIcon('search', {class: 'bg-white absolute top-1 ml1 left-0 h2 w2 color-green'})
    return html`
      <div class="relative dat-input db">
        ${searchIcon}
        <input style="overflow:hidden;" class="f3 pv3 pr4 pl3 indent w-100 dat-input__input h3" name="import-dat" type="text" placeholder="preview dat://" onkeydown=${keydown} />
      </div>
    `
  }
}
