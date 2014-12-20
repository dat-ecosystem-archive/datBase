var l = require('level-prebuilt')
var sub = require('level-sublevel')
var db = l('data', function() {
  db = sub(db)
  metadb = db.sublevel('metadat')
  metadb.createValueStream().on('data', function(data){  console.log(data) })
})
