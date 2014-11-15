var Ractive = require('ractive');
var page = require('page');
var main = require('./main.js');

var init = {
  ctx: function (ctx, next) {
    ctx.data = {};
    main(ctx, function () {
      next();
    });
  }
}

var routes = {
  splash: function (ctx, next) {
    ctx.template = require('./templates/pages/splash.html');
    next();
  },
  about: function (ctx, next) {
    ctx.template = require('./templates/pages/about.html');
    next();
  },
  profile: function (ctx, next) {
    ctx.data.user = ctx.state.user
    ctx.template = require('./templates/pages/profile.html');
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
  });

  $('a:not(.server)').click(function(e){
    var href = $(this).attr('href')
    page(href)
    e.preventDefault()
  })
}

page('*', init.ctx)
page('/', routes.splash);
page('/about', routes.about);
page('/profile',  routes.profile);
page('/publish', routes.publish);
page('/browse', routes.browse);
page('*', render)
page({click: false});
