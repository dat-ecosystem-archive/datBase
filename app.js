var hyperdrive = require('hyperdrive')
var concat = require('concat-stream')
var level = require('level-browserify')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var choppa = require('choppa')
var swarm = require('hyperdrive-archive-swarm')
var db = level('./dat.db')
var drive = hyperdrive(db)
var speedometer = require('speedometer')
var prettyBytes = require('pretty-bytes')
var path = require('path')
var intro = require('intro.js')
var explorer = require('./')

var $hyperdrive = document.querySelector('#hyperdrive-ui')
var $shareLink = document.getElementById('share-link')

var keypath = window.location.hash.substr(1).match('([^/]+)(/?.*)')
var key = keypath ? keypath[1] : null
var file = keypath ? keypath[2] : null
var cwd = '/'

if (file) {
  getArchive(key, function (archive) {
    archive.createFileReadStream(file).pipe(concat(function (data) {
      document.write(data)
    }))
  })
} else {
  installDropHandler()
  main(key)
}

function updatePeers (peers) {
  if (!peers) peers = 0
  document.querySelector('#peers').innerHTML = peers + ' source' + (peers > 1 || peers === 0 ? 's' : '')
}

function getArchive (key, cb) {
  var archive = drive.createArchive(key, {live: true})
  var sw = swarm(archive)
  sw.on('connection', function (peer) {
    updatePeers(sw.connections)
    peer.on('close', function () {
      updatePeers(sw.connections)
    })
  })
  archive.open(function () { cb(archive) })
  attachSpeedometer(archive)
}

document.querySelector('#help').onclick = function () {
  var introjs = intro.introJs()
  introjs.setOptions({
    steps: [
      {
        intro: 'You can create a new hyperdrive by clicking <b>Reset</b>'
      },
      {
        intro: 'Drop some files here',
        element: '#help-text'
      },
      {
        intro: 'You can share the hyperdrive with this link',
        element: 'input#share-link',
        position: 'bottom'
      }
    ]})
  introjs.start()
}

function main (key) {
  var button = document.querySelector('#new')
  button.onclick = function () { main(null) }

  var help = document.querySelector('#help-text')
  help.innerHTML = 'looking for sources …'
  $hyperdrive.innerHTML = ''

  getArchive(key, function (archive) {
    if (archive.owner) {
      help.innerHTML = 'drag and drop files'
    }
    installDropHandler(archive)
    window.location = '#' + archive.key.toString('hex')
    updateShareLink()

    function onclick (ev, entry) {
      if (entry.type === 'directory') {
        cwd = entry.name
      }
    }
    var tree = explorer(archive, onclick)
    $hyperdrive.appendChild(tree)
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
      var i = 0
      loop()

      function loop () {
        if (i === files.length) return console.log('added files to ', archive.key.toString('hex'), files)

        var file = files[i++]
        var stream = fileReader(file)
        var entry = {name: path.join(cwd, file.fullPath), mtime: Date.now(), ctime: Date.now()}
        stream.pipe(choppa(16 * 1024)).pipe(archive.createFileWriteStream(entry)).on('finish', loop)
      }
    })
  } else {
    clearDrop = drop(document.body, function () {
      window.alert('You are not the owner of this drive.  Click "Reset" to create a new drive.')
    })
  }
}

function attachSpeedometer (archive) {
  var speed = speedometer(1)
  var $els = {
    speed: document.getElementById('speed'),
    upload: document.getElementById('upload-speed'),
    download: document.getElementById('download-speed')
  }
  var timer
  function update (direction, data) {
    if (!data.length) return
    var bytesPerSecond = speed(data.length)
    if (bytesPerSecond && $els[direction]) {
      $els.speed.style.display = 'block'
      $els[direction].innerHTML = direction + ' ' + prettyBytes(bytesPerSecond)
      window.clearTimeout(timer)
      timer = window.setTimeout(function () {
        $els.speed.style.display = 'none'
        $els.upload.innerHTML = ''
        $els.download.innerHTML = ''
      }, 1500)
    }
  }
  archive.on('upload', function (data) {
    update('upload', data)
  })
  archive.on('download', function (data) {
    update('download', data)
  })
}
