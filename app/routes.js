module.exports = {
  splash: function (ctx, next) {
    ctx.template = require('./templates/pages/splash.html');
    next();
  },
  about: function (ctx, next) {
    ctx.template = require('./templates/pages/about.html');
    next();
  },
  profile: function (ctx, next) {
    if (!ctx.state.user) {
      ctx.template = require('./templates/pages/404.html');
      return next();
    }
    ctx.data.user = ctx.state.user
    ctx.template = require('./templates/pages/profile.html');
    ctx.onrender = require('./controllers/profile.js')
    next();
  },
  browse: function (ctx, next) {
    ctx.template = require('./templates/metadat/browse.html');
    next();
  },
  publish: function (ctx, next) {
    ctx.template = require('./templates/metadat/publish.html');
    ctx.onrender = require('./controllers/publish.js')
    next();
  }
};