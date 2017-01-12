module.exports = Dats

function Dats (model) {
  if (!(this instanceof Dats)) return new Dats(model)
  this.model = model
}

Dats.prototype.post = function (ctx, cb) {
  if (!ctx.user && !ctx.user.id) return cb(new Error('Must be logged in to do that.'))
  if (!ctx.body.name) return cb(new Error('Name required.'))
  ctx.body.user_id = ctx.user.id
  this.model.create(ctx.body, cb)
}

Dats.prototype.put = function (ctx, cb) {
  var self = this
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  if (!ctx.body.id) return cb(new Error('id required'))
  self.model.get({id: ctx.body.id}, function (err, results) {
    if (err) return cb(err)
    if (!results) return cb(new Error('Dat does not exist.'))
    if (results[0].user_id !== ctx.user.id) return cb(new Error('Cannot update someone elses dat.'))
    self.model.update({id: ctx.body.id}, function (err, data) {
      if (err) return cb(err)
      cb(null, {updated: data})
    })
  })
}

Dats.prototype.get = function (ctx, cb) {
  var join = ['users', 'users.id', 'dats.user_id']
  if (ctx.query.id) {
    ctx.query['dats.id'] = ctx.query.id
    delete ctx.query.id
  }
  return this.model.get(ctx.query, join, cb)
}

Dats.prototype.delete = function (ctx, cb) {
  var self = this
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  self.model.get({id: ctx.body.id}, function (err, results) {
    if (err) return cb(err)
    if (!results) return cb(new Error('Dat does not exist.'))
    if (results[0].user_id !== ctx.user.id) return cb(new Error('Cannot delete someone elses dat.'))
    self.model.delete({id: ctx.body.id}, function (err, data) {
      if (err) return cb(err)
      cb(null, {deleted: data})
    })
  })
}
