const html = require('choo/html')
const css = require('sheetify')

var prefix = css`
  :host {
    width: 4rem;
    #p1, #p2 {
      animation:
        size cubic-bezier(0.165, 0.84, 0.44, 1) 1.8s,
        opacity cubic-bezier(0.3, 0.61, 0.355, 1) 1.8s;
      animation-iteration-count: infinite;
      transform-origin: 50% 50%;
      stroke-opacity: 1;
    }
    #p2 {
      animation-delay: -.9s;
    }
  }
  @keyframes size {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
  }
  @keyframes opacity {
    0% { stroke-opacity: 1; }
    100% { stroke-opacity: 0; }
  }
`

module.exports = function () {
  return html`
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="${prefix}">
      <g fill="none" fill-rule="evenodd" stroke-width="5" stroke-linecap="round"
     stroke-linejoin="round">
       <polygon id="p1" points="30 1.9 6 15.95 6 44.05 30 58.1 54 44.05 54 15.95 30 1.9"/>
       <polygon id="p2" points="30 1.9 6 15.95 6 44.05 30 58.1 54 44.05 54 15.95 30 1.9"/>
     </g>
    </svg>
   `
}
