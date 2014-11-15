(function () {
  // private api

  var cache = {};

  function get (url, cb) {
    if (cache[url]) return cb(cache[url]);
    $.ajax({
      url: url,
      success: function(data) {
        cache[url] = data;
        cb(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      },
      dataType: 'text'
    });
  }

  // public api

  window.init = {
    ctx: function (ctx, next) {
      ctx.data = {};
      ctx.partials = {};
      next();
    }
  };

  window.route = {
    home: function (ctx, next) {
      get('templates/splash.html', function (html) {
        ctx.data.index = 0;
        ctx.partials.content = html;
        next();
      });
    },
    profile: function (ctx, next) {
      get('templates/profile.html', function (html) {
        ctx.data.index = 2;
        ctx.partials.content = html;
        next();
      });
    },
  };

  window.render = {
    content: function (ctx, next) {
      var template = Hogan.compile('{{>content}}');
      var content = template.render(ctx.data, ctx.partials);
      $('#content').empty().append(content);
      if (typeof done === 'function') done(ctx.data.index);
    }
  };

  window.done = null;
}());