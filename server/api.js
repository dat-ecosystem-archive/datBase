const send = require('appa/send')
const jsonBody = require('body/json')
const error = require('appa/error')

module.exports = function api (model, ship) {
  function onerror (err, res) {
    return error(400, err.message).pipe(res)
  }

  function verify (req, res, cb) {
    ship.verify(req, res, function (err, decoded, token) {
      if (err) return onerror(err, res)
      if (!decoded) return onerror(new Error('Not authorized.'), res)
      cb()
    })
  }

  return {
    get: function (req, res, params) {
      verify(req, res, function () {
        if (Object.keys(params).length > 0) {
          model.get(params, function (err, data) {
            if (err) return onerror(err, res)
            send(data).pipe(res)
          })
        } else {
          model.list(function (err, data) {
            if (err) return onerror(err, res)
            send(data).pipe(res)
          })
        }
      })
    },
    put: function (req, res, params) {
      jsonBody(req, res, function (err, body) {
        if (err) return onerror(err, res)
        if (!body.id) return onerror(new Error('id required'), res)
        model.update({id: body.id}, body, function (err, num) {
          if (err) return onerror(err, res)
          send({updated: num}).pipe(res)
        })
      })
    },
    delete: function (req, res, params) {
      jsonBody(req, res, function (err, body) {
        if (err) return onerror(err, res)
        if (!body.id) return onerror(new Error('id required'), res)
        model.delete({id: body.id}, function (err, data) {
          if (err) return onerror(err, res)
          send({deleted: data}).pipe(res)
        })
      })
    },
    post: function (req, res, params) {
      var err = new Error('Use /auth/v1/register to create new users.')
      return error(400, err.message).pipe(res)
    }
  }
}
