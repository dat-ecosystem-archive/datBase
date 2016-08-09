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
        entries: data.entries || state.archive.entries,
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
    load: function (data, state, send, done) {
      window.alert('this should load the archive', data)
      setTimeout(() => done(), 1000)
    }
  }
}
