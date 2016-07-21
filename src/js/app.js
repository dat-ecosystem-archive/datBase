var hyperdrive = require('hyperdrive')
var concat = require('concat-stream')
var level = require('level-browserify')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var choppa = require('choppa')
var swarm = require('hyperdrive-archive-swarm')
var db = level('./dat.db')
var drive = hyperdrive(db)
var path = require('path')
var explorer = require('hyperdrive-ui')
var pump = require('pump')
var progress = require('progress-stream')
var QueuedFileModel = require('./models/queued-file-model.js')

var $hyperdrive = document.querySelector('#hyperdrive-ui')
var $shareLink = document.getElementById('share-link')

var componentCtors = require('./components')
var components = [
  componentCtors.Help('help'),
  componentCtors.FileQueue('file-queue'),
  componentCtors.Header('header', {
    create: function (event) {
      initArchive()
    },
    download: function (link) {
      initArchive(link)
    }
  }),
  componentCtors.HyperdriveSize('hyperdrive-size'),
  componentCtors.HyperdriveStats('hyperdrive-stats'),
  componentCtors.Peers('peers'),
  componentCtors.Permissions('permissions'),
  componentCtors.SpeedDisplay('speed')
]

var store = require('./store')
store.subscribe(function (state) {
  for (var c in components) {
    if (components[c].update) {
      components[c].update(state)
    }
  }
})

window.addEventListener('hashchange', main)

var cwd = ''
main()

function main () {
  var keypath = window.location.hash.substr(1).match('([^/]+)(/?.*)')
  var key = keypath ? keypath[1] : null
  var file = keypath ? keypath[2] : null

  if (file) {
    getArchive(key, function (archive) {
      store.dispatch({ type: 'INIT_ARCHIVE', archive: archive })
      archive.createFileReadStream(file).pipe(concat(function (data) {
        document.write(data)
      }))
    })
  } else {
    installDropHandler()
    initArchive(key)
  }
}

function getArchive (key, cb) {
  if ((typeof key) === 'string') key = new Buffer(key, 'hex')
  var archive = drive.createArchive(key, {live: true, sparse: true})
  var sw = swarm(archive)
  sw.on('connection', function (peer) {
    store.dispatch({ type: 'UPDATE_PEERS', peers: sw.connections })
    peer.on('close', function () {
      store.dispatch({ type: 'UPDATE_PEERS', peers: sw.connections })
    })
  })
  archive.open(function () {
    if (archive.content) {
      archive.content.get(0, function (data) {
        // XXX: Hack to fetch a small bit of data so size properly updates
      })
    }
    cb(archive)
  })

  archive.on('download', function () {
    store.dispatch({type: 'UPDATE_ARCHIVE', archive: archive})
  })
  archive.on('upload', function () {
    store.dispatch({type: 'UPDATE_ARCHIVE', archive: archive})
  })
}

function initArchive (key) {
  var help = document.querySelector('#help-text')
  help.innerHTML = 'looking for sources …'
  $hyperdrive.innerHTML = ''

  getArchive(key, function (archive) {
    help.innerHTML = ''
    installDropHandler(archive)
    var link = archive.key.toString('hex')
    window.location = '#' + link
    $shareLink.innerHTML = link // XXX: move to its own component

    function onclick (ev, entry) {
      if (entry.type === 'directory') {
        cwd = entry.name
      }
    }
    var tree = explorer(archive, onclick)
    $hyperdrive.appendChild(tree)
    store.dispatch({ type: 'INIT_ARCHIVE', archive: archive })
  })
}

var clearDrop
function installDropHandler (archive) {
  if (clearDrop) clearDrop()

  if (archive && archive.owner) {
    clearDrop = drop(document.body, function (files) {
      // TODO: refactor this into `hyperdrive-write-queue` module
      files.forEach(function (file) {
        store.dispatch({ type: 'QUEUE_NEW_FILE', file: new QueuedFileModel(file) })
      })
      var i = 0
      loop()

      function loop () {
        store.dispatch({ type: 'UPDATE_ARCHIVE', archive: archive })
        if (i === files.length) {
          return console.log('added files to ', archive.key.toString('hex'), files)
        }
        var file = files[i++]
        var stream = fileReader(file)
        var entry = {name: path.join(cwd, file.fullPath), mtime: Date.now(), ctime: Date.now()}
        file.progressListener = progress({ length: stream.size, time: 50 }) // time: ms
        store.dispatch({ type: 'QUEUE_WRITE_BEGIN' })
        pump(
          stream,
          choppa(4 * 1024),
          file.progressListener,
          archive.createFileWriteStream(entry),
          function (err) {
            if (err) {
              file.writeError = true
            } else {
              file.progress = { complete: true }
              store.dispatch({ type: 'QUEUE_WRITE_COMPLETE', file: file })
            }
            loop()
          }
        )
      }
      // end /TODO: `hyperdrive-write-queue` module
    })
  } else {
    clearDrop = drop(document.body, function () {
      window.alert('You are not the owner of this drive.  Click "Reset" to create a new drive.')
    })
  }
}
