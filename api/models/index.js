var subdown = require('subleveldown')
var restParser = require('rest-parser')
var changesFeed = require('changes-feed')
var changesdown = require('changesdown')
var sqliteSearch = require('sqlite-search')

var metadat = require('./metadat.js')
var users = require('./users.js')
var tracker = require('./tracker.js')

var defaults = require('../defaults.js')
var indexer = require('../indexer.js')
var searchIndexer = require('../searchIndexers.js')

module.exports = function (db, opts) {
  var models = {
    users: createIndexedModel(users, 'users'),
    metadat: createIndexedModel(metadat, 'metadat'),
    tracker: createIndexedModel(tracker, 'tracker')
  }

  // TODO: replace with inline index
  models.users.byGithubId = subdown(db, 'githubId')

  var searchOpts = {
    path: defaults.DAT_SEARCH_DB,
    primaryKey: 'id',
    columns: ['id', 'name', 'owner_id', 'description']
  }

  sqliteSearch(searchOpts, function (err, searcher) {
    if (err) throw err
    models.metadat.searcher = searcher
    searchIndexer({
      searcher: searcher,
      state: models.metadat.state,
      feed: models.metadat.feed,
      db: models.metadat.indexdb,
      path: defaults.DAT_SEARCH_DB
    })
  })

  function createIndexedModel (createModel, name) {
    var sub = subdown(db, name)
    var changes = subdown(db, name + '-changes')
    var indexdb = subdown(db, name + '-index')
    var state = subdown(db, name + '-state')
    var feed = changesFeed(changes)
    var modeldb = changesdown(sub, feed, {valueEncoding: 'json'})

    var model = createModel(modeldb, opts)

    model.indexes = indexer({
      schema: model.schema,
      feed: feed,
      db: indexdb,
      state: state,
      model: model
    })

    model.indexdb = indexdb
    model.state = state
    model.feed = feed
    model.handler = restParser(model)
    return model
  }

  return models
}
