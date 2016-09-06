const html = require('choo/html')

module.exports = (state, prev, send) => {
  const writing = state.archive.importQueue.writing
  const next = state.archive.importQueue.next

  if (writing && !writing.progressHandler) {
    writing.progressPct = 0
    writing.progressHandler = (progress) => {
      const pct = parseInt(progress.percentage)
      send('archive:updateImportQueue', {writingProgressPct: pct, writing: writing}, function () {})
    }
    writing.progressListener.on('progress', writing.progressHandler)
  }

  return render()

  function render () {
    if (writing || next.length > 0) {
      return html`<table id="import-queue">
        ${writing ? renderLi(writing) : null}
        ${next.map(function (file) {
          return renderLi(file)
        })}
      </table>`
    } else {
      return html`<table id="import-queue"></table>`
    }
  }

  function renderLi (file) {
    return html`<tr>
      <td class="name">${file.fullPath}</td>
      <td>${renderProgress(file)}</td>
    </tr>`
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
