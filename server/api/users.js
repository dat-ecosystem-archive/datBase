module.exports = Users

function Users (model) {
  if (!(this instanceof Users)) return new Users(model)
  if (!model) throw new Error('model required')
  this.model = model
}

Users.prototype.post = function (ctx, cb) {
  return cb(new Error('Use /auth/v1/register to create a new user.'))
}

Users.prototype.put = function (ctx, cb) {
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  if (!ctx.body.id) return cb(new Error('id required'))
  if (ctx.user.id !== ctx.body.id) return cb(new Error('You cannot update other users.'))
  this.model.update({id: ctx.body.id}, ctx.body, function (err, data) {
    if (err) return cb(err)
    cb(null, {updated: data})
  })
}

Users.prototype.get = function (ctx, cb) {
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  if (Object.keys(ctx.query).length > 0) return this.model.get(ctx.query, cb)
  return this.model.list(cb)
}

Users.prototype.delete = function (ctx, cb) {
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  if (!ctx.body.id) return cb(new Error('id required.'))
  if (ctx.user.id !== ctx.body.id) return cb(new Error('You cannot delete other users.'))
  this.model.delete({id: ctx.body.id}, function (err, data) {
    if (err) return cb(err)
    cb(null, {deleted: data})
  })
}
