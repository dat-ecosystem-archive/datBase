const html = require('choo/html')

module.exports = (state, prev, send) => {
  const writing = state.archive.importQueue.writing
  const prevWriting = prev && prev.archive ? prev.archive.importQueue.writing : null
  const next = state.archive.importQueue.next

  if ((writing && !prevWriting) ||
      (writing && prevWriting && writing.fullPath !== prevWriting.fullPath)) {
    writing.elsSuffix = encodeURIComponent(writing.fullPath)
    writing.progressPct = 0
    writing.progressHandler = _progressHandler
    writing.progressListener.on('progress', writing.progressHandler)
  }
  if (prevWriting) {
    prevWriting.progressListener.removeListener('progress', prevWriting.progressHandler)
  }

  return _render()

  function _render () {
    if (writing || next.length > 0) {
      return html`<ul id="file-queue">
        ${writing ? _renderLi(writing) : null}
        ${next.map(function (file) {
          return _renderLi(file)
        })}
      </ul>`
    } else {
      return html`<ul id="file-queue"></ul>`
    }
  }

  function _renderLi (file) {
    return html`<li>
      ${file.fullPath}
      ${_renderProgress(file)}
    </li>`
  }

  function _renderProgress (file) {
    if (file.writeError) {
      return html`<div class="progress error">Error</div>`
    }
    const id = file.elsSuffix
    let loaded = 0
    if (file.progressPct) loaded = file.progressPct
    let klass = 'progress__line--loading'
    if (file.progressPct === 100) klass = 'progress__line--complete'
    return html`<div class="progress">
       <div class="progress__counter" id="progress__counter--${id}">
        ${loaded}%
      </div>
       <div class="progress__bar">
         <div class="progress__line ${klass}" id="progress__line--${id}"
              style="width: ${loaded}%">
         </div>
       </div>
     </div>`
  }

  function _progressHandler (progress) {
    const id = writing.elsSuffix
    const pct = writing.progressPct = parseInt(progress.percentage)
    document.getElementById(`progress__counter--${id}`).innerHTML = pct + '%'
    document.getElementById(`progress__line--${id}`).style.width = pct + '%'
  }
}
