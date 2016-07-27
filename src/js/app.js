const choo = require('choo')
const app = choo()


// define models:
app.model(require('./models/archive'))

// define routes:
app.router((route) => [
  route('/', require('./views/main'))
])

// start app:
// TODO: figure out how to connect { hash:true } updates to main view
const tree = app.start('#choo-refactor-main', { hash: true })


// TODO: refactor everything below into choo framework paradigm:
var hyperdrive = require('hyperdrive')
var concat = require('concat-stream')
var level = require('level-browserify')
var drop = require('drag-drop')
var swarm = require('hyperdrive-archive-swarm')
var db = level('./dat.db')
var drive = hyperdrive(db)
var explorer = require('hyperdrive-ui')
var hyperdriveImportQueue = require('hyperdrive-import-queue')

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
  var $addFiles = document.querySelector('#add-files')
  help.innerHTML = 'looking for sources …'
  $hyperdrive.innerHTML = ''
  $addFiles.innerHTML = ''

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
    $addFiles.appendChild(componentCtors.AddFiles({onfiles: (e) => importFiles(e.target.files, archive)}))
    store.dispatch({ type: 'INIT_ARCHIVE', archive: archive })
  })
}

function importFiles (files, archive) {
  if (!Array.isArray(files)) {
    // arrayify FileList
    files = Array.prototype.slice.call(files, 0)
    for (var i in files) {
      files[i].fullPath = '/' + files[i].name
    }
  }
  hyperdriveImportQueue(files, archive, {
    cwd: cwd,
    progressInterval: 50,
    onQueueNewFile: function (err, file) {
      if (err) console.log(err)
      store.dispatch({ type: 'QUEUE_NEW_FILE', file: file })
    },
    onFileWriteBegin: function (err, file) {
      if (err) console.log(err)
      store.dispatch({ type: 'QUEUE_WRITE_BEGIN' })
    },
    onFileWriteComplete: function (err, file) {
      if (err) console.log(err)
      store.dispatch({ type: 'UPDATE_ARCHIVE', archive: archive })
      store.dispatch({ type: 'QUEUE_WRITE_COMPLETE', file: file })
    },
    onCompleteAll: function () {}
  })
}

var clearDrop
function installDropHandler (archive) {
  if (clearDrop) clearDrop()

  if (archive && archive.owner) {
    clearDrop = drop(document.body, function (files) {
      importFiles(files, archive, cwd)
    })
  } else {
    clearDrop = drop(document.body, function () {
      window.alert('You are not the owner of this drive.  Click "Reset" to create a new drive.')
    })
  }
}
