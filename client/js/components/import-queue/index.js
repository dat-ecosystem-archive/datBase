const html = require('choo/html')

module.exports = (state, prev, send) => {
  const writing = state.archive.importQueue.writing
  const next = state.archive.importQueue.next

  return render()

  function render () {
    if (writing || next.length > 0) {
      return html`<ul id="import-queue">
        ${writing ? renderLi(writing) : null}
        ${next.map(function (file) {
          return renderLi(file)
        })}
      </ul>`
    } else {
      return html`<ul id="import-queue"></ul>`
    }
  }

  function renderLi (file) {
    return html`<li>
      ${file.fullPath}
      ${renderProgress(file)}
    </li>`
  }

  function renderProgress (file) {
    if (file.writeError) {
      return html`<div class="progress error">Error</div>`
    }
    var loaded = file.progressPct || 0
    var klass = loaded === 100 ? 'progress__line--complete' : 'progress__line--loading'
    return html`<div class="progress">
       <div class="progress__counter">
        ${loaded}%
      </div>
       <div class="progress__bar">
         <div class="progress__line ${klass}" style="width: ${loaded}%">
         </div>
       </div>
     </div>`
  }
}
