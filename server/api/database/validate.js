const validator = require('is-my-json-valid')

module.exports = {
  dats: validator({
    properties: {
      name: {
        required: true,
        type: 'string',
        pattern: '^[a-zA-Z-]+$'
      }
    },
    verbose: true
  })
}
