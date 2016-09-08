const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const swarm = require('hyperdrive-archive-swarm')
const collect = require('collect-stream')
const path = require('path')
const hyperdriveImportQueue = require('hyperdrive-import-queue')
const drop = require('drag-drop')

var drive = hyperdrive(memdb())
var noop = function () {}

module.exports = {
  namespace: 'archive',
  state: {
    metadata: {},
    key: null,
    file: null,
    error: null,
    size: null,
    numPeers: 0,
    entries: [],
    instance: null,
    signalhubs: [
      'signalhub.mafintosh.com',
      'signalhub.dat.land'
    ],
    importQueue: {
      writing: null,
      next: []
    }
  },
  reducers: {
    update: (data, state) => {
      return data
    },
    updatePeers: (data, state) => {
      return {numPeers: state.swarm.connections}
    },
    updateImportQueue: (data, state) => {
      // shallow copy the last `state` frame so we can preserve
      // file.progressListener refs:
      var stateCopy = {}
      stateCopy.writing = state.importQueue.writing
      stateCopy.next = state.importQueue.next
      // new file is enqueued:
      if (data.onQueueNewFile) stateCopy.next.push(data.file)
      // next file begins writing:
      if (data.onFileWriteBegin) {
        stateCopy.writing = stateCopy.next[0]
        stateCopy.next = stateCopy.next.slice(1)
      }
      // write progress on current file writing:
      if (data.writingProgressPct && data.writing && data.writing.fullPath) {
        if (stateCopy.writing && (stateCopy.writing.fullPath === data.writing.fullPath)) {
          stateCopy.writing.progressPct = data.writingProgressPct
        }
      }
      // current file is done writing:
      if (data.onFileWriteComplete) {
        stateCopy.writing = null
      }
      return {
        importQueue: {
          writing: stateCopy.writing,
          next: stateCopy.next
        }
      }
    }
  },
  subscriptions: [
    (send, done) => {
      drop(document.body, (files) => send('archive:importFiles', {files}, done))
    }
  ],
  effects: {
    new: function (data, state, send, done) {
      const archive = drive.createArchive(null, {live: true, sparse: true})
      const key = archive.key.toString('hex')
      send('archive:update', {instance: archive, swarm: swarm(archive), key}, noop)
      send('archive:import', key, done)
    },
    import: function (data, state, send, done) {
      const location = '/' + data
      send('location:setLocation', { location }, done)
      window.history.pushState({}, null, location)
      send('archive:update', {entries: {}}, noop)
      send('archive:load', data, done)
    },
    getMetadata: function (data, state, send, done) {
      // EXPERIMENTAL:
      // right now we are reading this from dat.json but perhaps we
      // will update this when we start using accounts and repos
      var archive = state.instance
      collect(archive.createFileReadStream('dat.json'), (err, raw) => {
        if (err) return done()
        var json
        try {
          json = JSON.parse(raw.toString())
        } catch (err) {
          // TODO: inform user
          json = {}
        }
        send('archive:update', {metadata: json}, done)
      })
    },
    importFiles: function (data, state, send, done) {
      var files = data.files
      const archive = state.instance
      if (data.createArchive || !archive) {
        send('archive:new', null, () => send('archive:importFiles', {files}, done))
        return
      }
      if (!archive.owner) {
        // XXX: use error in state
        window.alert('You can not put files in this archive')
        return done()
      }
      if (!Array.isArray(files)) {
        // arrayify FileList
        files = Array.prototype.slice.call(files, 0)
        for (var i in files) {
          files[i].fullPath = '/' + files[i].name
        }
      }
      hyperdriveImportQueue(files, archive, {
        cwd: state.cwd || '',
        progressInterval: 100,
        onQueueNewFile: function (err, file) {
          if (err) console.log(err)
          send('archive:updateImportQueue', {onQueueNewFile: true, file: file}, noop)
        },
        onFileWriteBegin: function (err, file) {
          if (err) console.log(err)
          send('archive:updateImportQueue', {onFileWriteBegin: true}, noop)
        },
        onFileWriteComplete: function (err, file) {
          if (err) console.log(err)
          if (file && file.progressListener && file.progressHandler) {
            file.progressListener.removeListener('progress', file.progressHandler)
          }
          send('archive:updateImportQueue', {onFileWriteComplete: true}, noop)
        },
        onCompleteAll: function () {}
      })
    },
    load: function (key, state, send, done) {
      var archive, sw
      if (state.instance && state.instance.drive) {
        if (state.instance.key.toString('hex') === key) {
          archive = state.instance
          sw = state.swarm
        } else {
          archive = null
        }
      }
      if (!archive) {
        send('archive:update', {key}, noop)
        archive = drive.createArchive(key)
        sw = swarm(archive)
        send('archive:update', {instance: archive, swarm: sw, key}, done)
      }
      sw.on('connection', function (conn) {
        send('archive:updatePeers', noop)
        conn.on('close', function () {
          send('archive:updatePeers', noop)
        })
      })
      archive.on('upload', function (data) {
        send('archive:update', {uploaded: data.length + (state.uploaded || 0)}, noop)
      })
      archive.on('download', function (data) {
        send('archive:update', {downloaded: data.length + (state.downloaded || 0)}, noop)
      })
      archive.open(function () {
        if (archive.content) {
          archive.content.get(0, function (data) {
            send('archive:update', {size: archive.content.bytes}, noop)
            // XXX: Hack to fetch a small bit of data so size properly updates
          })
        }
        send('archive:getMetadata', {}, noop)
        var stream = archive.list({live: true})
        var entries = {}
        stream.on('data', function (entry) {
          entries[entry.name] = entry
          var dir = path.dirname(entry.name)
          if (!entries[dir]) {
            entries[dir] = {
              type: 'directory',
              name: dir,
              length: 0
            }
          }
          const size = archive.content.bytes
          send('archive:update', {entries, size}, noop)
        })
      })
    },
    readFile: function (data, state, send, done) {
      var archive = state.instance
      var readStream = archive.createFileReadStream(data.entryName)
      done(readStream)
    }
  }
}
