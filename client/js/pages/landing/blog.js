var html = require('choo/html')
var fs = require('fs')
var path = require('path')
var marked = require('marked')
var header = require('./header')
var footer = require('./footer')
var posts = require('./posts')

module.exports = function (state, prev, send) {
  return html`
  <div>
  ${header(state, prev, send)}
  <header class="bg-white">
    <div class="container">
      <h1 class="content-title horizontal-rule">Dat Blog</h1>
    </div>
  </header>

  <section class="section bg-neutral-04">
    <div class="container">
      ${posts.map(function (post) {
        if (!post.date) return ''
        post.content = marked(fs.readFileSync(path.join(__dirname, 'posts', post.name + '.md')).toString())
        post.shortContent = post.content.substring(0, post.content.indexOf('</p>'))
        return html`
          <div class="post post--preview">
            <div class="document" id="${post.name}">
              <div class="f6 color-neutral-60">
                <span class="published">${post.relativeDate}</span>
                by
                <span class="author">${post.author}</span>
              </div>
              <a class="load-document" href="/blog/${post.name}">
                <h2 class="mt0">${post.title}</h2>
              </a>
              <div class="clearfix">
                <div class="f6 measure-wide">
                  ${post.shortContent} …
                </div>
                <a href="/blog/${post.name}" class="f6 btn btn--green fr">Read more</a>
              </div>
            </div>
          </div>`
      })}
    </div>
  </section>
  ${footer(state, prev, send)}
  </div>
  `
}
