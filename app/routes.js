module.exports = {
  splash: function (ctx, next) {
    ctx.ractive.template = require('./templates/pages/splash.html');
    next();
  },
  about: function (ctx, next) {
    ctx.ractive.template = require('./templates/pages/about.html');
    next();
  },
  profile: function (ctx, next) {
    if (!ctx.state.user) {
      ctx.ractive.template = require('./templates/pages/404.html');
      return next();
    }
    ctx.ractive = require('./controllers/profile.js')
    ctx.ractive.data.user = ctx.state.user
    next();
  },
  browse: function (ctx, next) {
    ctx.ractive.template = require('./templates/metadat/browse.html');
    next();
  },
  publish: function (ctx, next) {
    ctx.ractive = require('./controllers/publish.js')
    next();
  }
};