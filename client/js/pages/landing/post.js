var html = require('choo/html')
var relativeDate = require('relative-date')
var fs = require('fs')
var path = require('path')
var marked = require('marked')
var header = require('./header')
var footer = require('./footer')
var posts = require('./posts')

module.exports = function (state, prev, send) {
  var post = null
  posts.filter(function (apost) {
    if (apost.name === state.params.name) post = apost
  })
  post.content = marked(fs.readFileSync(path.join(__dirname, 'posts', post.name + '.md')).toString())
  return html`
  <div>
  ${header(state, prev, send)}
    <header class="bg-white">
      <div class="container">
        <a href="/blog" class="f6 fr mt3 pl2">« Back to all posts</a>
        <h1 class="content-title mb1 pb1">${post.title}</h1>
        <div class="content-subtitle horizontal-rule">
          <span class="published">Published ${relativeDate(new Date(post.date))} by ${post.author}</span>
        </div>
      </div>
    </header>

    <section class="section bg-neutral-04">
      <div class="container">
        <div id="post">
          <div class="post">
            <p class="teaser">
              ${post.tease}r
            </p>
            <div class="content">
              ${marked(post.content)}
            </div>
          </div>
        </div>
      </div>
    </section>
  ${footer(state, prev, send)}
  </div>
  `
}
