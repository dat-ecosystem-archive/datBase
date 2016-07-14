var hyperdrive = require('hyperdrive')
var concat = require('concat-stream')
var level = require('level-browserify')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var encoding = require('dat-encoding')
var choppa = require('choppa')
var swarm = require('hyperdrive-archive-swarm')
var db = level('./dat.db')
var drive = hyperdrive(db)
var path = require('path')
var explorer = require('hyperdrive-ui')
var pump = require('pump')
var progress = require('progress-stream')

var $hyperdrive = document.querySelector('#hyperdrive-ui')
var $shareLink = document.getElementById('share-link')

var componentCtors = require('./components')
var components = [
  componentCtors.Help('help'),
  componentCtors.FileQueue('file-queue'),
  componentCtors.HyperdriveSize('hyperdrive-size'),
  componentCtors.HyperdriveStats('hyperdrive-stats'),
  componentCtors.Peers('peers'),
  componentCtors.ResetButton('new', initArchive),
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

var cwd = '/'
main()

function main () {
  var keypath = window.location.hash.substr(1).match('([^/]+)(/?.*)')
  var key = keypath ? encoding.decode(keypath[1]) : null
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
        console.log('archive.content.get <-- retrieve a bit of data for sizing')
        // XXX: Hack to fetch a small bit of data so size properly updates
      })
    }
    cb(archive)
  })
  archive.on('download', function () {
    console.log('archive.on `download`')
    store.dispatch({type: 'UPDATE_ARCHIVE', archive: archive})
  })
  archive.on('upload', function () {
    console.log('!!!archive.on `upload`')
    store.dispatch({type: 'UPDATE_ARCHIVE', archive: archive})
  })
}

function initArchive (key) {
  var help = document.querySelector('#help-text')
  help.innerHTML = 'looking for sources …'
  $hyperdrive.innerHTML = ''

  getArchive(key, function (archive) {
    if (archive.owner) {
      help.innerHTML = 'drag and drop files'
    } else {
      // XXX: this should depend on sw.connections
      help.innerHTML = ''
    }
    installDropHandler(archive)
    window.location = '#' + encoding.encode(archive.key)
    updateShareLink()

    function onclick (ev, entry) {
      if (entry.type === 'directory') {
        cwd = entry.name
      }
    }
    var tree = explorer(archive, onclick)
    $hyperdrive.appendChild(tree)
    console.log('store.dispatch INIT_ARCHIVE')
    store.dispatch({ type: 'INIT_ARCHIVE', archive: archive })
  })
}

function updateShareLink () {
  $shareLink.value = window.location
}

var clearDrop
function installDropHandler (archive) {
  if (clearDrop) clearDrop()

  if (archive && archive.owner) {
    clearDrop = drop(document.body, function (files) {
      // TODO: refactor this into `hyperdrive-write-queue` module
      console.log('clearDrop i=0', archive)
      console.log('clearDrop files', files)
      var i = 0
      loop()

      function loop () {
        console.log('UPDATE_ARCHIVE')
        store.dispatch({ type: 'UPDATE_ARCHIVE', archive: archive })
        if (i === files.length) {
          return console.log('loop() DONE; added files to ', archive.key.toString('hex'), files)
        }
        var file = files[i++]
        var stream = fileReader(file)
        var entry = {name: path.join(cwd, file.fullPath), mtime: Date.now(), ctime: Date.now()}
        console.log('init streamProgress')
        file.writeProgress = progress({ length: stream.size, time: 50 }) // time: ms
        console.log('store.dispatch QUEUE_NEW_FILE')
        store.dispatch({ type: 'QUEUE_NEW_FILE', file: file })
        console.log('start pump()')
        pump(
          stream,
          choppa(4 * 1024),
          file.writeProgress,
          archive.createFileWriteStream(entry),
          function (err) {
            if (err) throw err
            console.log('DONE PUMPING! clearDrop i=', i, archive)
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
