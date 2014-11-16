var Ractive = require('ractive');
var page = require('page');

var main = require('./main.js');
var user = require('./user.js');

var init = {
  ctx: function (ctx, next) {
    // default for all pages
    ctx.template = require('./templates/pages/404.html')
    ctx.data = {};
    ctx.onrender = function () {};

    main(ctx, next)
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
    next();
  }
};

function render(ctx, next) {
  var ractive = new Ractive({
    el: "#content",
    template: ctx.template,
    data: ctx.data,
    onrender: function () {
      $('a:not(.server)').click(function(e){
        var href = $(this).attr('href')
        page(href)
        e.preventDefault()
      })

      ctx.onrender.call(this)
    }
  });

}

page('*', init.ctx)
page('/', routes.splash);
page('/about', routes.about);
page('/profile',  routes.profile);
page('/publish', routes.publish);
page('/browse', routes.browse);
page('*', render)
page({click: false});
