const html = require('choo/html')

module.exports = function (props) {
  if (!props) props = {}
  props.header = props.header || "404"
  props.body = props.body || "We couldn't find the droids you were looking for. Is the link correct?"
  return html`
    <div>
    <div class="error-page">
       <div class="mb3">
         <img src="./public/img/dat-data-logo.svg" />
       </div>
       <h3>${props.header}</h3>
       <p class="mb3">${props.body}</p>
       <p class="mb4">
         <button class="btn btn--large btn--green take-me-home" href="/">Take me home</button>
       </p>
     </div>
   </div>`
}
