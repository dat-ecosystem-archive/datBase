module.exports = function (opts) {
  return `<div>
  <p>Welcome!</p>
  <p>You recently signed up for a https://datproject.org account. If that wasn't you, you can delete this email.</p>
  <p>Verify your account email by clicking this link:</p>
  <p><b><a href="${opts.url}">Verify My Account</a></b></p>
  <p>Or by following this url:</p>
  <p><a href="${opts.url}">${opts.url}</a></p>
  </div>`
}
