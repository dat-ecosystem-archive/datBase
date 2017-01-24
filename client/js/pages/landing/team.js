var html = require('choo/html')
var header = require('./header')
var footer = require('./footer')

module.exports = function (state, prev, send) {
  function avatar (username) {
    return "background-image: url('https://github.com/" + username + ".png')"
  }
  var doc = html`
  <div>
    ${header(state, prev, send)}
    <header>
      <div class="container">
        <h1 class="content-title horizontal-rule">Development Team</h1>
      </div>
    </header>

    <section class="section bg-neutral-04">
      <div class="container">
        <div class="gallery">
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="${avatar('maxogden')}"></div>

            <div class="gallery-item-contents">
              <div class="gallery-item-title">Max Ogden</div>
              <div class="gallery-item-subtitle">
                Programmer based in Portland, OR. Max works on or has worked on things like <a href="http://csvconf.com/">CSVConf</a>, <a href="http://codeforamerica.org/">Code for America</a>, <a href="http://jsforcats.com/">JavaScript for Cats</a>, and <a href="http://voxeljs.com/">Voxel.js</a>.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="${avatar('mafintosh')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Mathias Buus</div>
              <div class="gallery-item-subtitle">
                Programmer based in Copenhagen, Denmark. Co-creator of <a href="http://node-modules.com">node-modules.com</a> and co-founder of <a href="http://ge.tt/">ge.tt</a>. open mouth, open source.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="${avatar('karissa')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Karissa McKelvey</div>
              <div class="gallery-item-subtitle">
                Programmer and data scientist based in Oakland, CA. Former <a href="http://scholar.google.com/citations?user=RM2tB8EAAAAJ&hl=en">academic</a> experienced in building interactive data visualization and collaboration tools.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('juliangruber')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Julian Gruber</div>
              <div class="gallery-item-subtitle">
                Programmer traveling the world. Contributor to projects like <a href="https://nodejs.org">Node.js</a> and <a href="https://leveldb.org/">LevelDB</a>. Has a strong drive to rid humanity of redundant work and empower everyone to think big.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('clkao')}"></div>

            <div class="gallery-item-contents">
              <div class="gallery-item-title">Chia-liang Kao</div>
              <div class="gallery-item-subtitle">
                Developer and civic hacker based in Taipei, Taiwan. Co-founder of <a href="http://g0v.asia/tw/">g0v.tw</a>.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('joehand')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Joe Hand</div>
              <div class="gallery-item-subtitle">
                Programmer and open data enthusiast based in Portland, OR. Joe previously <a href="http://santafe.edu/research/informal-settlements/">built tools</a> for communities in informal settlements worldwide to collect data.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('kriesse')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Kristina Schneider</div>
              <div class="gallery-item-subtitle">
                Designer based in Berlin, Germany. Kriesse organizes community events like <a href="http://www.cssconf.eu/">CSSconf EU</a>, <a href="http://cssclass.es">CSSclasses</a> and <a href="http://up.front.ug/">upfront.ug</a>.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('yoshuawuyts')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Yoshua Wuyts</div>
              <div class="gallery-item-subtitle">
                ✨ 🚂 ✌️
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="content-title horizontal-rule" id="advisors">Advisors</div>
      </div>

      <div class="container">
        <div class="gallery">
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('freeman-lab')}"></div>

            <div class="gallery-item-contents">
              <div class="gallery-item-title">Jeremy Freeman</div>
              <div class="gallery-item-subtitle">Group Leader, Jenelia Research Campus.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('waldoj')}"></div>

            <div class="gallery-item-contents">
              <div class="gallery-item-title">Waldo Jaquith</div>
              <div class="gallery-item-subtitle">Director of U.S. Open Data and a Shuttleworth Foundation Fellow.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('blahah')}"></div>

            <div class="gallery-item-contents">
              <div class="gallery-item-title">Richard Smith-Unna</div>
              <div class="gallery-item-subtitle">A biologist, hacker, and PhD student in Plant Sciences in the Hibberd Lab at the University of Cambridge. A <a href="http://rik.smith-unna.com/2015/10/07/i-am-now-a-mozilla-science-fellow/">Mozilla Fellow for Science</a> for 2015-16.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('kaythaney')}"></div>

            <div class="gallery-item-contents">
              <div class="gallery-item-title">Kaitlin Thaney</div>
              <div class="gallery-item-subtitle">
                Director, Mozilla Science Lab (<a href="http://twitter.com/mozillascience">@MozillaScience</a>). Using data for good at <a href="http://twitter.com/datakindUK">@datakindUK</a>, frequent flyer, and other general geekery.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="content-title horizontal-rule" id="advisors">Alumni</div>
      </div>

      <div class="container">
        <div class="gallery">
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('melaniecebula')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Melanie Cebula</div>
              <div class="gallery-item-subtitle">
                 Computer Science major at UC Berkeley, software engineer, Hackers@Berkeley officer, open source contributor, makeup artist, swing dancer, huge foodie, feminist, and classically trained musician!
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('pkafei')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Portia Burton</div>
              <div class="gallery-item-subtitle">
                Programmer based in Portland, OR. Founder of <a href="http://www.plbanalytics.com/">PLB Analytics</a>, and author of O'Reilly's upcoming 'Data Science in Python' video. Worked on <a href="https://github.com/datproject/dat">Dat</a> CLI tools.
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('bmpvieira')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Bruno Vieira</div>
              <div class="gallery-item-subtitle">
                Bioinformatics PhD student at Queen Mary University of London and Node.JS Web Developer. Working on <a href="https://github.com/bionode/bionode">bionode.io</a> and <a href="https://github.com/yeban/afra">yeban/afra</a>.
              </div>
            </div>
          </div>
           <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('ywyw')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Yuhong Wang</div>
              <div class="gallery-item-subtitle">
                Programmer in the bay area. Worked on Dat special use cases!
              </div>
            </div>
          </div>
           <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('jbenet')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Juan Batiz-Benet</div>
              <div class="gallery-item-subtitle">
                Juan is a computer scientist, engineer, and entrepreneur. He is obsessed with knowledge and studied Computer Science at Stanford University
              </div>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-item-avatar" style="$(avatar('finnp')}"></div>
            <div class="gallery-item-contents">
              <div class="gallery-item-title">Finn Pauls</div>
              <div class="gallery-item-subtitle">
                Computer Science student at Free University Berlin, Open Source developer, Organizer of <a href="http://nodeschool.io/berlin/"> NodeSchool Berlin</a>, Contributor to the <a href="http://ndjson.org/">NDJSON spec</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    ${footer(state, prev, send)}
    </div>
  `
  return doc
}
