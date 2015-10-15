var Ractive = require('ractive-toolkit')
var page = require('page')
var dom = require('dom')
var enterMeansSubmit = require('enter-means-submit')
var main = require('./controllers/main.js')
var routes = require('./routes.js')
var helpers = require('./helpers.js')

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

function render (ctx, next) {
  new Ractive({
    el: '#content',
    template: ctx.ractive.template,
    data: ctx.ractive.data,
    partials: ctx.ractive.partials,
    components: ctx.ractive.components,
    onrender: function () {
      dom('a:not(.no-page)').each(function (element) {
        element[0].onclick = function (event) {
          var href = this.getAttribute('href')
          page(href)
          event.preventDefault()
        }
      })

      enterMeansSubmit(document.getElementsByClassName('form'))

      ctx.ractive.onrender.call(this)
    }
  })

}

function requiresAuth (ctx, next) {
  if (!ctx.state.user) {
    ctx.ractive.template = require('./templates/pages/restricted.html')
    return render(ctx, next)
  }
  next()
}

function requiresAdmin (ctx, next) {
  if (!ctx.state.user.admin) {
    ctx.ractive.template = require('./templates/pages/restricted.html')
    return render(ctx, next)
  }
  next()
}

page('*', init.ctx)
page('/', routes.splash)
page('/about', routes.about)
page('/browse', routes.browse)
page('/browse/:query', routes.browse)

page('/publish', requiresAuth, routes.publish)

page('/admin', requiresAuth, requiresAdmin, routes.admin)

page('/profile', routes.profile)
page('/profile/:handle', routes.profile)
page('/settings', requiresAuth, routes.settings)

page('/view/:id', routes.view)

page('*', render)
page({click: false})
