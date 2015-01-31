var subdown = require('subleveldown')
var restParser = require('rest-parser')
var changesFeed = require('changes-feed')
var changesdown = require('changesdown')
var sqliteSearch = require('sqlite-search')

var metadat = require('./metadat.js')
var users = require('./users.js')
var defaults = require('../defaults.js')
var indexer = require('../indexer.js')
var searchIndexer = require('../searchIndexers.js')

module.exports = function(db, opts) {
  var usersSub = subdown(db, 'users')
  var usersChanges = subdown(db, 'users-changes')

  var metadatSub = subdown(db, 'metadat')
  var metadatChanges = subdown(db, 'metadat-changes')
  var metadatIndexDb = subdown(db, 'metadat-index')
  var metadatStateDb = subdown(db, 'metadat-state')

  var usersFeed = changesFeed(usersChanges)
  var metadatFeed = changesFeed(metadatChanges)

  var usersDb = changesdown(usersSub, usersFeed, {valueEncoding: 'json'})
  var metadatDb = changesdown(metadatSub, metadatFeed, {valueEncoding: 'json'})

  var models = {
    users: users(usersDb, opts),
    metadat: metadat(metadatDb, opts)
  }

  models.metadat.indexes = indexer({
    schema: models.metadat.schema,
    feed: metadatFeed,
    db: metadatIndexDb,
    state: metadatStateDb,
    model: models.metadat
  })

  var searchOpts = {
    path: defaults.DAT_SEARCH_DB,
    primaryKey: 'id',
    columns: ["id", "name", "owner_id", "description"]
  }

  sqliteSearch(searchOpts, function(err, searcher) {
    if (err) console.error('error!', err)
    models.metadat.searcher = searcher
    searchIndexer({
      searcher: searcher,
      state: metadatStateDb,
      feed: metadatFeed,
      db: metadatIndexDb,
      path: defaults.DAT_SEARCH_DB
    })
  })

  // initialize rest parsers for each model
  models.users.handler = restParser(models.users)
  models.metadat.handler = restParser(models.metadat)

  // TODO replace with a more proper secondary indexing solution
  models.users.byGithubId = subdown(db, 'githubId')

  return models
}