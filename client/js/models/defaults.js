module.exports = {
  error: undefined,
  explore: {
    data: [],
    limit: 10,
    offset: 0
  },
  profile: {
    dats: [],
    id: null,
    email: null,
    name: null,
    username: null,
    description: null
  },
  township: {
    username: null,
    profile: {},
    key: null,
    email: null,
    whoami: false,
    token: null,
    register: 'hidden',
    sidePanel: 'hidden',
    passwordResetResponse: null,
    passwordResetConfirmResponse: null
  },
  preview: {
    isPanelOpen: false,
    isLoading: false,
    entry: null,
    error: false
  },
  message: {
    message: ''
  },
  archive: {
    health: null,
    id: null,
    updatedAt: false,
    key: null,
    retries: 0,
    peers: 0,
    error: null,
    root: '',
    metadata: {},
    fetching: false,
    entries: []
  }
}
