const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const drop = require('drag-drop')
const speedometer = require('speedometer')
const Jszip = require('jszip')
const saveAs = require('file-saver').saveAs
const Promise = require('es6-promise').Promise
const getMetadata = require('../utils/metadata.js')
const Dat = require('./dat.js')
const xtend = require('xtend')

var drive = hyperdrive(memdb())
var noop = function () {}

const DEFAULT_SIGNAL_HUBS = process.env.DATLAND_SIGNAL_HUBS
? process.env.DATLAND_SIGNAL_HUBS.split(/,/)
: [
  'https://signalhub.mafintosh.com'
]

var defaultState = {
  key: null,
  instance: null,
  health: {
    connected: 0,
    blocks: 0,
    peers: [],
    bytes: 0
  },
  file: null,
  error: null,
  metadata: {},
  entries: [],
  root: '',
  numPeers: 0,
  swarm: null,
  signalhubs: DEFAULT_SIGNAL_HUBS,
  uploadMeter: null,
  uploadSpeed: 0,
  uploadTotal: 0,
  downloadMeter: null,
  downloadSpeed: 0,
  downloadTotal: 0
}

module.exports = {
  namespace: 'archive',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.archive,
  reducers: {
    update: (data, state) => {
      return xtend(state, data)
    },
    updateDownloaded: (downloaded, state) => {
      const meter = state.downloadMeter || speedometer(3)
      return {
        downloadMeter: meter,
        downloadTotal: (state.downloadTotal || 0) + downloaded,
        downloadSpeed: meter(downloaded)
      }
    },
    updateUploaded: (uploaded, state) => {
      const meter = state.uploadMeter || speedometer(3)
      return {
        uploadMeter: meter,
        uploadTotal: (state.uploadTotal || 0) + uploaded,
        uploadSpeed: meter(uploaded)
      }
    },
    reset: (data, state) => {
      if (state.swarm && state.swarm.close) state.swarm.close(function () {})
      return Object.assign({}, defaultState)
    }
  },
  subscriptions: [
    (send, done) => {
      drop(document.body, (files) => send('archive:importFiles', {files}, done))
    }
  ],
  effects: {
    new: function (data, state, send, done) {
      if (state.swarm && state.swarm.close) state.swarm.close(function () {})
      send('archive:reset', noop)
      send('archive:create', null, function (_, key) {
        const location = '/view/' + key
        send('location:setLocation', { location }, noop)
        window.history.pushState({}, null, location)
      })
    },
    updateMetadata: function (data, state, send, done) {
      getMetadata(state.instance, function (err, metadata) {
        if (err) return done(err)
        send('archive:update', {metadata}, done)
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
        window.alert('You cannot put files in this archive')
        return done()
      }
      if (!Array.isArray(files)) {
        // arrayify FileList
        files = Array.prototype.slice.call(files, 0)
        for (var i in files) {
          files[i].fullPath = '/' + files[i].name
        }
      }
      send('importQueue:add', {files: files, root: state.root}, noop)
      return done()
    },
    create: function (key, state, send, done) {
      if (state.instance && state.instance.key.toString('hex') === key) return done()
      var dat = Dat(drive, key, state.signalhubs, send)
      key = dat.archive.key.toString('hex')
      var stream = dat.archive.list({live: true})
      stream.on('data', function (entry) {
        var entries = state.entries
        entries.push(entry)
        if (entry.name === 'dat.json' || entry.name === 'datapackage.json') send('archive:updateMetadata', {}, noop)
        send('archive:update', {entries}, noop)
      })
      send('importQueue:init', {archive: dat.archive}, noop)
      var newState = {
        instance: dat.archive,
        swarm: dat.swarm,
        key: key
      }
      send('archive:update', newState, function () {
        done(null, key)
      })
    },
    load: function (key, state, send, done) {
    },
    readFile: function (data, state, send, done) {
      var archive = state.instance
      var readStream = archive.createFileReadStream(data.entryName)
      done(readStream)
    },
    downloadAsZip: function (data, state, send, done) {
      const archive = state.instance
      const zip = new Jszip()
      var zipName
      var promises = []

      if (data && data.entryName) { // single file download as zip
        zipName = data.entryName
        var promise = new Promise(function (resolve, reject) {
          archive.get(data.entryName, {timeout: 1500}, function (err, entry) {
            if (err) return reject()
            zip.file(data.entryName, archive.createFileReadStream(data.entryName))
            resolve()
          })
        })
        promises.push(promise)
      } else { // download entire archive as zip
        zipName = state.key
        state.entries.forEach((entry) => {
          if (entry && entry.type === 'file') {
            var promise = new Promise(function (resolve, reject) {
              archive.get(entry.name, {timeout: 1500}, function (err, entry) {
                if (err) return reject()
                zip.file(entry.name, archive.createFileReadStream(entry.name))
                resolve()
              })
            })
            promises.push(promise)
          }
        })
      }

      return Promise.all(promises)
        .then(function () {
          zip
          .generateAsync({type: 'blob'})
          .then((content) => {
            saveAs(content, `${zipName}.zip`)
            done()
          })
        })
        .catch(function () {
          window.alert('We cannot find peers to download this dat from at this time. Try using the dat desktop app instead.')
        })
    }
  }
}
