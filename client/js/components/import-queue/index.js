const html = require('choo/html')

module.exports = (state, prev, send) => {
  const writing = state.archive.importQueue.writing
  const writingProgressPct = state.archive.importQueue.writingProgressPct
  const next = state.archive.importQueue.next

  return render()

  function render () {
    if (writing || next.length > 0) {
      return html`<ul id="import-queue">
        ${writing ? renderLi(writing, writingProgressPct) : null}
        ${next.map(function (file) {
          return renderLi(file, null)
        })}
      </ul>`
    } else {
      return html`<ul id="import-queue"></ul>`
    }
  }

  function renderLi (file, progressPct) {
    return html`<li>
      ${file.fullPath}
      ${renderProgress(file, progressPct)}
    </li>`
  }

  function renderProgress (file, progressPct) {
    if (file.importError) {
      return html`<div class="progress error">Error</div>`
    }
    var loaded = progressPct || 0
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
