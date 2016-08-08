module.exports = {
  namespace: 'user',
  state: {
    username: null
  },
  reducers: {
    update: (data, state) => {
      return {
        username: data.username || state.username
      }
    }
  }
}
