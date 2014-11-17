var Ractive = require('ractive');
var page = require('page');

var routes = require('./routes.js')
var main = require('./controllers/main.js');
var user = require('./models/user.js');

var init = {
  ctx: function (ctx, next) {
    // default for all pages
    ctx.template = require('./templates/pages/404.html')
    ctx.data = {};
    ctx.onrender = function () {};

    main(ctx, next)
  }
}

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
