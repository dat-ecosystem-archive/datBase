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
      return {
        key: data.key || state.key,
        entries: data.entries || state.entries,
        file: data.file || state.file,
        instance: data.instance || state.instance,
        swarm: data.swarm || state.swarm,
        numPeers: data.numPeers || state.numPeers,
        signalhubs: data.signalhubs || state.signalhubs
      }
    }
  },
  subscriptions: [
    (send, done) => {
      var drive = hyperdrive(memdb())
      var key = window.location.pathname.replace('/','')
      var archive = drive.createArchive(key)
      var sw = swarm(archive)
      sw.on('connection', function (conn) {
        send('archive:updatePeers', noop)
        conn.on('close', function () {
          send('archive:updatePeers', noop)
        })
      })
      send('archive:update', {instance: archive, swarm: sw}, noop)
    }
  ],
  effects: {
    new: function (data, state, send, done) {
      window.alert('this should create a new archive')
      setTimeout(() => done(), 1000)
    },
    import: function (data, state, send, done) {
      document.location.pathname = '/' + state.key
    }
  }
}
