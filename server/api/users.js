module.exports = Users

function Users (model) {
  if (!(this instanceof Users)) return new Users(model)
  if (!model) throw new Error('model required')
  this.model = model
}

Users.prototype.post = function (req, cb) {
  return cb(new Error('Use /api/v1/register to create a new user.'))
}

Users.prototype.put = function (req, cb) {
  if (!req.user) return cb(new Error('Must be logged in to do that.'))
  if (!req.body.id) return cb(new Error('id required'))
  if (req.user.id !== req.body.id) return cb(new Error('You cannot update other users.'))
  this.model.update({id: req.body.id}, req.body, function (err, data) {
    if (err) return cb(err)
    cb(null, {updated: data})
  })
}

Users.prototype.get = function (req, cb) {
  if (!req.user) return cb(new Error('Must be logged in to do that.'))
  return this.model.get(req.query, cb)
}

Users.prototype.delete = function (req, cb) {
  if (!req.user) return cb(new Error('Must be logged in to do that.'))
  if (!req.body.id) return cb(new Error('id required.'))
  if (req.user.id !== req.body.id) return cb(new Error('You cannot delete other users.'))
  this.model.delete({id: req.body.id}, function (err, data) {
    if (err) return cb(err)
    cb(null, {deleted: data})
  })
}
