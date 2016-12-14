module.exports = Dats

function Dats (model) {
  if (!(this instanceof Dats)) return new Dats(model)
  this.model = model
}

Dats.prototype.post = function (ctx, cb) {
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  this.model.create(ctx.body, cb)
}

Dats.prototype.put = function (ctx, cb) {
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  if (!ctx.body.id) return cb(new Error('id required'))
  this.model.update({id: ctx.body.id}, function (err, data) {
    if (err) return cb(err)
    cb(null, {updated: data})
  })
}

Dats.prototype.get = function (ctx, cb) {
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  if (Object.keys(ctx.params).length > 1) return this.model.get(ctx.params, cb)
  else return this.model.list(cb)
}

Dats.prototype.delete = function (ctx, cb) {
  if (!ctx.user) return cb(new Error('Must be logged in to do that.'))
  this.model.delete({id: ctx.body.id}, function (err, data) {
    if (err) return cb(err)
    cb(null, {deleted: data})
  })
}
