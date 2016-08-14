const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const swarm = require('hyperdrive-archive-swarm')
const encoding = require('dat-encoding')
const path = require('path')

let noop = function () {}
let drive = hyperdrive(memdb())

module.exports = {
  namespace: 'archive',
  state: {
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
    ]
  },
  reducers: {
    updatePeers: (data, state) => {
      return {numPeers: state.swarm.connections}
    },
    update: (data, state) => {
      return data
    }
  },
  subscriptions: [
    (send, done) => {
      let key
      try {
        key = encoding.decode(window.location.pathname.replace('/', ''))
      } catch (e) {
        // TODO: throw error to user
      }
      if (!key) return
    }
  ],
  effects: {
    new: function (data, state, send, done) {
      const archive = drive.createArchive(null, {live: true, sparse: true})
      const link = archive.key.toString('hex')
      send('archive:import', link, done)
    },
    import: function (data, state, send, done) {
      const location = '/' + data
      send('location:setLocation', { location }, done)
      window.history.pushState({}, null, location)
      send('archive:update', {entries: {}}, noop)
      send('archive:load', data, done)
    },
    load: function (key, state, send, done) {
      send('archive:update', {key}, noop)
      if (state.instance) {
        // XXX: cleanup original instance
      }
      let archive = drive.createArchive(key)
      let sw = swarm(archive)
      send('archive:update', {instance: archive, swarm: sw}, done)
      sw.on('connection', function (conn) {
        send('archive:updatePeers', noop)
        conn.on('close', function () {
          send('archive:updatePeers', noop)
        })
      })
      archive.on('download', function () {
        console.log('download')
      })
      archive.on('upload', function () {
        console.log('upload')
      })
      archive.open(function () {
        if (archive.content) {
          archive.content.get(0, function (data) {
            send('archive:update', {size: archive.content.bytes}, noop)
            // XXX: Hack to fetch a small bit of data so size properly updates
          })
        }
        var stream = archive.list({live: true})
        var entries = {}
        stream.on('data', function (entry) {
          entries[entry.name] = entry
          let dir = path.dirname(entry.name)
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
    }
  }
}
