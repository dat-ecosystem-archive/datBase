// TODO: rehydrate this model with archive data from server
module.exports = {
  namespace: 'archive',
  state: {
    key: null,
    file: null,
    numPeers: 0,
    signalhubs: [
      'signalhub.mafintosh.com',
      'signalhub.dat.land'
    ]
  },
  reducers: {
    update: (data, state) => {
      return {
        key: null,
        file: null
      }
    }
  },
  effects: {
    newArchive: function (data, state, send, done) {
      console.log('whack new archive')
      window.alert('this should create a new archive')
      setTimeout(() => done(), 1000)
    }
  }
}
