const send = require('appa/send')
const jsonBody = require('body/json')
const error = require('appa/error')

module.exports = function api (model) {
  function onerror (err, res) {
    return error(400, err.message).pipe(res)
  }

  return {
    get: function (req, res, params) {
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
    },
    put: function (req, res, params) {
      jsonBody(req, res, function (err, body) {
        if (err) return onerror(err, res)
        if (!body.id) return onerror(new Error('id required'), res)
        model.update({id: body.id}, body, function (err, data) {
          if (err) return onerror(err, res)
          send(data).pipe(res)
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
      jsonBody(req, res, function (err, body) {
        if (err) return onerror(err, res)
        model.create(body, function (err, data) {
          if (err) return onerror(err, res)
          if (!data) data = []
          send(data).pipe(res)
        })
      })
    }
  }
}
