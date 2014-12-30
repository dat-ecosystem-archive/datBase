var Ractive = require('ractive');
var page = require('page');
var $ = jQuery = require('jquery');

var main = require('./controllers/main.js')
var routes = require('./routes.js')

var templateHelpers = Ractive.defaults.data

templateHelpers.prettyJSON = function (json) {
  return JSON.stringify(json, undefined, 2);
}

templateHelpers.errorClass = function (state) {
  return this.get(state) ? 'has-error' : '';
}

templateHelpers.loadingClass = function() {
  return this.get('loading') ? 'btn-disabled' : 'btn-success';
}

templateHelpers.loadingText = function (text) {
  return this.get('loading') ? 'Loading' : text
}

var init = {
  ctx: function (ctx, next) {
    // default for all pages
    ctx.ractive = {
      template: require('./templates/pages/404.html'),
      data: {},
      partials: {},
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
    partials: ctx.ractive.partials,
    onrender: function () {
      $('a:not(.no-page)').click(function(e){
        var href = $(this).attr('href')
        page(href)
        e.preventDefault()
      })

      // TODO: pull this out into a module that
      // you give an element and it grabs all inputs and sets the enclosing button[type="submit"]
      // as the one to click
      var ENTER_KEY = 13;

      $("input").keypress(function (e) {
        var submitTarget = $(this).data('submit-target');
        if ((e.which && e.which == ENTER_KEY) || (e.keyCode && e.keyCode == ENTER_KEY)) {
            $(submitTarget).click();
            return false;
        } else {
            return true;
        }
      });

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

page('*',               init.ctx)
page('/',               routes.splash);
page('/about',          routes.about);
page('/browse',         routes.browse);

page('/settings',       requiresAuth, routes.settings);
page('/publish',        requiresAuth, routes.publish);

page('/profile/:handle',routes.profile);
page('/view/:id',       routes.view);

page('*',             render)
page({click: false});
