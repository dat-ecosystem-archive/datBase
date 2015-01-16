var subdown = require('subleveldown')
var restParser = require('rest-parser')
var changesFeed = require('changes-feed')
var changesdown = require('changesdown')

var metadat = require('./metadat.js')
var users = require('./users.js')

module.exports = function(db, opts) {
  var usersSub = subdown(db, 'users')
  var usersChanges = subdown(db, 'users-changes')
  
  var metadatSub = subdown(db, 'metadat')
  var metadatChanges = subdown(db, 'metadat-changes')
  
  var usersFeed = changesFeed(usersChanges)
  var metadatFeed = changesFeed(metadatChanges)
  
  var usersDb = changesdown(usersSub, usersFeed, {valueEncoding: 'json'})
  var metadatDb = changesdown(metadatSub, metadatFeed, {valueEncoding: 'json'})
  
  var models = {
    users: users(usersDb, opts),
    metadat: metadat(metadatDb, opts)
  }

  // initialize rest parsers for each model
  models.users.handler = restParser(models.users)
  models.metadat.handler = restParser(models.metadat)

  // TODO replace with a more proper secondary indexing solution
  models.users.byGithubId = subdown(db, 'githubId')
  
  return models
}