module.exports = function (opts) {
  return `<div>
  <p>Hello!</p>
  <p>You recently requested to reset your password. If that wasn't you, you can delete this email.</p>
  <p>Reset your password by clicking this link:</p>
  <p><b><a href="${opts.reseturl}">Reset password</a></b></p>
  <p>Or by following this url:</p>
  <p><a href="${opts.reseturl}">${opts.reseturl}</a></p>
  </div>`
}
