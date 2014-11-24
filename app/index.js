var Ractive = require('ractive');
var page = require('page');

var routes = require('./routes.js')
var main = require('./controllers/main.js');
var user = require('./models/user.js');

var helpers = Ractive.defaults.data

helpers.prettyJSON = function (json) {
  return JSON.stringify(json, undefined, 2);
}

helpers.errorClass = function (state) {
  return this.get(state) ? 'has-error' : '';
}

helpers.loadingClass = function() {
  return this.get('loading') ? 'btn-disabled' : 'btn-success';
}

helpers.loadingText = function (text) {
  return this.get('loading') ? 'Loading' : text
}

var init = {
  ctx: function (ctx, next) {
    // default for all pages
    ctx.ractive = {
      template: require('./templates/pages/404.html'),
      data: {},
      onrender: function () {}
    }

    main(ctx, next)
  }
}

function render(ctx, next) {
  var ractive = new Ractive({
    el: "#content",
    template: ctx.ractive.template,
    data: ctx.ractive.data,
    onrender: function () {
      $('a:not(.no-page)').click(function(e){
        var href = $(this).attr('href')
        page(href)
        e.preventDefault()
      })

      ctx.ractive.onrender.call(this)
    }
  });

}

function requiresAuth(ctx, next) {
  if (!ctx.state.user) {
    ctx.ractive.template = require('./templates/pages/restricted.html');
    return render(ctx, next)
  }
  next()
}

page('*',           init.ctx)
page('/',           routes.splash);
page('/about',      routes.about);
page('/profile',    requiresAuth, routes.profile);
page('/publish',    routes.publish);
page('/view/:id',   routes.view);
page('/browse',     routes.browse);
page('*',           render)
page({click: false});
