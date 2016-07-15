var yo = require('yo-yo')

module.exports = FileQueue

function FileQueue (el) {
  if (!(this instanceof FileQueue)) return new FileQueue(el)
  this.$el = document.getElementById(el)
  this._queue = []
  this._component = this._render()

  if (this.$el) this.$el.appendChild(this._component)
}

FileQueue.prototype.update = function (state) {
  var self = this
  if (state && state.fileQueueReducer) {
    this._queue = state.fileQueueReducer.queue
    console.log('[FileQueue] this._queue', this._queue)
    yo.update(this._component, this._render())

    if (this._queue && this._queue.length > 0) {
      this._queue.map(function (file) {
        if (file.progressListener) {
          file.progressListener.on('progress', function (progress) {
            file.progress = progress
            yo.update(self._component, self._render())
          })
        }
      })
    }
  }
}

FileQueue.prototype._render = function () {
  var self = this
  return yo`<ul>
    ${this._queue.map(function (file) {
      return self._renderLi(file)
    })}
    </ul>`
}

FileQueue.prototype._renderLi = function (file) {
  return yo`<li>
    ${file.fullPath}
    ${this._renderProgress(file)}
    </li>`
}

FileQueue.prototype._renderProgress = function (file) {
  var loaded = 0
  if (file && file.progress && file.progress.percentage) {
    loaded = parseInt(file.progress.percentage) // no decimal points, plz
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
