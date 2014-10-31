var level = require('level-prebuilt'),
    bytewise = require('bytewise/hex'),
    debug = require('debug')('models'),
    levelQuery = require('level-queryengine'),
    fulltextEngine = require('fulltext-engine');

var MetaDat = require('./metadat.js'),
    Users = require('./users.js');

module.exports = function(opts) {
  var db = levelQuery(level(opts.DAT_REGISTRY_DB,
    { keyEncoding: bytewise, valueEncoding: 'json' }))

  db.query.use(fulltextEngine())
  db.ensureIndex('name', 'fulltext', fulltextEngine.index());

  return {
    db: db,
    users: new Users(db),
    metadat: new MetaDat(db)
  }
}