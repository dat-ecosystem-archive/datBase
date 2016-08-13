const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const swarm = require('hyperdrive-archive-swarm')
const encoding = require('dat-encoding')

let noop = function () {}
let drive = hyperdrive(memdb())

module.exports = {
  namespace: 'archive',
  state: {
    key: null,
    file: null,
    error: null,
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
        error: data.error || state.error,
        instance: data.instance || state.instance,
        swarm: data.swarm || state.swarm,
        numPeers: data.numPeers || state.numPeers,
        signalhubs: data.signalhubs || state.signalhubs
      }
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
      let archive = drive.createArchive(key)
      let sw = swarm(archive)
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
      const location = '/' + data
      send('archive:update', {key: data}, noop)
      send('location:setLocation', { location }, done)
      window.history.pushState({}, null, location)
    }
  }
}
