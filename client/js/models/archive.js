const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const swarm = require('hyperdrive-archive-swarm')

let noop = function () {}

module.exports = {
  namespace: 'archive',
  state: {
    key: null,
    file: null,
    numPeers: 0,
    entries: [],
    signalhubs: [
      'signalhub.mafintosh.com',
      'signalhub.dat.land'
    ]
  },
  reducers: {
    update: (data, state) => {
      return {
        key: data.key || state.key,
        entries: data.entries || state.entries,
        file: data.file || state.file,
        numPeers: data.numPeers || state.numPeers,
        signalhubs: data.signalhubs || state.signalhubs
      }
    }
  },
  effects: {
    new: function (data, state, send, done) {
      window.alert('this should create a new archive')
      setTimeout(() => done(), 1000)
    },
    import: function (data, state, send, done) {
      document.location.pathname = '/' + state.key
    },
    updatePeers: function (data, state, send, done) {
      state.numPeers = state.swarm.connections
      send('archive:update', state, function () {
      })
    },
    join: function (data, state, send, done) {
      var drive = hyperdrive(memdb())
      var archive = drive.createArchive(state.key)
      var sw = swarm(archive)
      state.swarm = sw
      sw.on('connection', function (conn) {
        send('archive:updatePeers', noop)
        conn.on('close', function () {
          send('archive:updatePeers', noop)
        })
      })
      done(null, archive)
    }
  }
}
