var Ractive = require('ractive');
var page = require('page');

var user = require('./user.js');

var init = {
  ctx: function (ctx, next) {
    ctx.data = {};
    ctx.partials = {};
    next();
  }
};

var routes = {
  splash: function (ctx, next) {
    ctx.template = require('./templates/splash.html');
    next();
  },
  about: function (ctx, next) {
    ctx.template = require('./templates/about.html');
    next();
  },
  profile: function (ctx, next) {
    ctx.template = require('./templates/profile.html');
    next();
  },
  browse: function (ctx, next) {
    ctx.template = require('./templates/metadat/browse.html');
    next();
  },
  publish: function (ctx, next) {
    ctx.template = require('./templates/metadat/publish.html');
    next();
  }
};

function render(ctx, next) {
  window.ractive = new Ractive({
    el: "#content",
    template: ctx.template,
    data: ctx.data
  })
}

page('*', init.ctx);
page('/', routes.splash);
page('/about', routes.about);
page('/profile', user.load, routes.profile);
page('/publish', routes.publish);
page('/browse', routes.browse);
page('*', render)
page({click: false});

$('a:not(.server)').click(function(e){
  var href = $(this).attr('href')
  page(href)
  e.preventDefault()
})
