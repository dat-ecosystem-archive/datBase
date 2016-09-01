const html = require('choo/html')

module.exports = function (props) {
  if (!props) props = {}
  props.header = props.header || '404'
  props.body = props.body || 'We could not find the droids you were looking for. Is the link correct?'
  return html`
    <div>
    <div class="error-page">
      <div class="mb3">
        <svg viewBox="0 0 240 240" style="fill: currentColor; width: 6rem;"><title>Sad Dat</title><path d="M220.5 56.71l-96-55.5a9 9 0 0 0-9 0l-96 55.5A9 9 0 0 0 15 64.5v111a9 9 0 0 0 4.5 7.79l96 55.5a9 9 0 0 0 9 0l96-55.5a9 9 0 0 0 4.5-7.79v-111a9 9 0 0 0-4.5-7.79zM207 170.31l-87 50.3-87-50.3V69.69l87-50.3 87 50.3z"/><path d="M69.81 145.48a9 9 0 0 0 12.73 0 53.24 53.24 0 0 1 75.2 0 9 9 0 0 0 12.73-12.73 71.26 71.26 0 0 0-100.66 0 9 9 0 0 0 0 12.73zM82 98.61V81.39a9 9 0 0 0-18 0v17.22a9 9 0 0 0 18 0zm85 9a9 9 0 0 0 9-9V81.39a9 9 0 0 0-18 0v17.22a9 9 0 0 0 9 9z"/></svg>
      </div>
      <h3>${props.header}</h3>
      <p class="mb3">${props.body}</p>
      <p class="mb4">
       <button class="btn btn--large btn--green take-me-home" href="/">Take me home</button>
      </p>
     </div>
   </div>`
}
