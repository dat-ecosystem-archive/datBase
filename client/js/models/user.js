var defaultState = {
  username: null
}

module.exports = {
  namespace: 'user',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
  reducers: {
    update: (data, state) => {
      return {
        username: data.username || state.username
      }
    }
  }
}
