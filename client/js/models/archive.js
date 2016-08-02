// TODO: rehydrate this model with archive data from server
module.exports = {
  namespace: 'archive',
  state: {
    key: null,
    file: null
  },
  reducers: {
    update: (data, state) => {
      return {
        key: null,
        file: null
      }
    }
  }
}
