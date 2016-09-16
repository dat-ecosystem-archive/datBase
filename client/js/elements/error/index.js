var html = require('choo/html')

module.exports = (error) => {
  if (error) {
    if (error.message === 'Could not find entry') {
      return html`<div class="error">
        Add a dat.json or datapackage.json file for more detail. <a href="https://github.com/juliangruber/dat.json" target="_blank">Learn more.</a>
      </div>`
    }
    return html`<div>${error.message}</div>`
  } else return ''
}
