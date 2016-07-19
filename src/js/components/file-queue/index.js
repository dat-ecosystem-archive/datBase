var yo = require('yo-yo')

module.exports = FileQueue

function FileQueue (el) {
  if (!(this instanceof FileQueue)) return new FileQueue(el)
  this.$el = document.getElementById(el)
  this._queue = undefined
  this._component = this._render()

  if (this.$el) this.$el.appendChild(this._component)
}

FileQueue.prototype.update = function (state) {
  if (state && state.fileQueueReducer) {
    var q = state.fileQueueReducer.queue
    var lastState = q[q.length - 2]
    var newState = q[q.length - 1]

    if (!this._queue) {
        this._queue = q
    } else {
      if (newState && newState.writing) {
        if ((!lastState.writing && newState.writing.fullPath) ||
            (lastState.writing.fullPath !== newState.writing.fullPath)) {
          this._addProgressListenerCb(newState.writing)
        }
      }
      if (newState && !newState.writing) {
        if (lastState && lastState.writing && lastState.writing.progressHandler) {
          this._removeProgressListenerCb(lastState.writing)
        }
      }
    }

    yo.update(this._component, this._render())
  }
}

FileQueue.prototype._addProgressListenerCb = function (file) {
  var self = this

  file.progressHandler = function (progress) {
    file.progress = progress
    yo.update(self._component, self._render())
  }

  file.progressListener.on('progress', file.progressHandler)
}

FileQueue.prototype._removeProgressListenerCb = function (file) {
  file.progressListener.removeListener('progress', file.progressHandler)
  file.progressHandler = null
}

FileQueue.prototype._render = function () {
  var self = this

  function empty () {
    return yo`<ul></ul>`
  }

  if (this._queue && this._queue.length) {
    var newState = this._queue[this._queue.length - 1]
    if (newState && (newState.writing || newState.next.length > 0)) {
      return yo`<ul>
        ${newState.writing ? this._renderLi(newState.writing) : undefined}
        ${newState.next.map(function (file) {
          return self._renderLi(file)
        })}
        </ul>`
    }
    else {
      return empty()
    }
  } else {
    return empty()
  }
}

FileQueue.prototype._renderLi = function (file) {
  return yo`<li>
    ${file.fullPath}
    ${this._renderProgress(file)}
    </li>`
}

FileQueue.prototype._renderProgress = function (file) {
  var loaded = 0
  if (file.writeError) {
    return yo`<div class="progress error">Error</div>`
  }
  if (file && file.progress && file.progress.percentage) {
    loaded = parseInt(file.progress.percentage) // no decimals, plz
  }
  return yo`<div class="progress">
     <div class="progress__counter">${loaded}%</div>
     <div class="progress__bar">
       <div class="progress__line progress__line--loading"
            style="width: ${loaded}%">
       </div>
     </div>
   </div>`
}
