var yo = require('yo-yo')

module.exports = FileQueue

function FileQueue (el) {
  if (!(this instanceof FileQueue)) return new FileQueue(el)
  this.$el = document.getElementById(el)
  this._queue = {
    writing: undefined,
    next: undefined
  }
  this._component = this._render()

  if (this.$el) this.$el.appendChild(this._component)
}

FileQueue.prototype.update = function (state) {
  var self = this
  if (state && state.fileQueueReducer) {

    // see notes in app.js loop
    this._queue = state.fileQueueReducer.queue


    console.log('[FileQueue] this._queue', this._queue)
    yo.update(this._component, this._render())


    // FIXME: this is a bad pattern for more than 1 file at a time
    // you'll need to add the progressListener callback below
    // when the file enters the app.js clearDrop loop()
    // BUT you want ALL the files to show in the FileQueue list
    // before that, just with a 0% progress bar until the
    // writing begins/progressListener added
    // If we don't fix this below, a progress listener is added
    // to every file each time a new file is added or removed from
    // the queue! Sad!
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

FileQueue.prototype._addProgressCallback = function () {
  // add the progress listener from above^^
}

FileQueue.prototype._render = function () {
  var self = this
  return yo`<ul>

    ${self._renderLi(this._queue.writing)}

    ${this._queue.next.map(function (file) {
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
    return yo`<div class="progress">
       <div class="progress__counter">${loaded}%</div>
       <div class="progress__bar">
         <div class="progress__line progress__line--loading"
              style="width: ${loaded}%">
         </div>
       </div>
     </div>`
  }
}
