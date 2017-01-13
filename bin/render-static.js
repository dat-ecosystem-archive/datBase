var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var relativeDate = require('relative-date')
var cheerio = require('cheerio')
var marked = require('marked')
var Handlebars = require('handlebars')

var outDir = path.join(__dirname, '..', 'public', 'rendered')

// clear previously rendered stuff
rimraf.sync(outDir)
mkdirp.sync(outDir)
mkdirp.sync(outDir + '/blog')

var posts = require('../public/js/posts.js')

var templates = {
  index: readTemplate('index'),
  about: readTemplate('about'),
  blog: readTemplate('blog'),
  post: readTemplate('post'),
  splash: readTemplate('splash'),
  team: readTemplate('team'),
  docs: readTemplate('docs')
}

function readTemplate (file) {
  return fs.readFileSync(path.join(__dirname, '..', 'public', 'html', file + '.html')).toString()
}

posts.forEach(function (post) {
  post.relativeDate = relativeDate(post.date)
  var dom = cheerio.load(templates.index)
  post.content = marked(fs.readFileSync(path.join(__dirname, '..', 'public', 'posts', post.name + '.md')).toString())
  post.shortContent = post.content.substring(0, 300)
  post.relativeDate = relativeDate(new Date(post.date))
  var rendered = Handlebars.compile(templates.post)({posts: posts, post: post})
  dom('#content').html(rendered)
  dom('#' + post.name).addClass('active')
  dom('a[href="/blog"]').addClass('active')
  fs.writeFileSync(outDir + '/blog/' + post.name, dom.html())
})

var rendered = Handlebars.compile(templates.blog)({posts: posts})
renderStatic(rendered, 'blog/index.html')

renderStatic(templates.splash, 'index')
renderStatic(templates.about, 'about')
renderStatic(templates.team, 'team')
renderStatic(templates.docs, 'docs')

function renderStatic (template, target) {
  var dom = cheerio.load(templates.index)
  dom('#content').html(template)
  dom('a[href="/' + target + '"]').addClass('active')
  if (target === 'index') target = 'index.html'
  fs.writeFileSync(outDir + '/' + target, dom.html())
}
