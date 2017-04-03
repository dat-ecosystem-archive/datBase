var fs = require('fs')
var path = require('path')

module.exports = [
  {
    date: '2017-04-03',
    title: 'Previewing and downloading in the browser',
    author: 'Karissa McKelvey',
    teaser: 'Now you can send browser links to dats for previewing and downloading items',
    name: '2017-04-03',
    raw: fs.readFileSync(path.join(__dirname, '2017-04-03.md')).toString()
  },
  {
    date: '2017-03-08',
    title: 'Berlin Hack week',
    author: 'Yoshua Wuyts',
    teaser: 'Half the Dat team spent a week hacking in Berlin',
    name: '2017-03-08-berlin-hack-week',
    raw: fs.readFileSync(path.join(__dirname, '2017-03-08-berlin-hack-week.md')).toString()
  },
  {
    date: '2017-02-21',
    title: 'Dat Desktop is here',
    author: 'Yoshua Wuyts',
    teaser: 'Powerful data sharing from your desktop.',
    name: '2017-02-21-dat-desktop-is-here',
    raw: fs.readFileSync(path.join(__dirname, '2017-02-21-dat-desktop-is-here.md')).toString()
  },
  {
    date: '2017-01-09',
    title: 'Preview the New Dat CLI',
    author: 'Joe Hand',
    teaser: 'Install the new release of the Dat command line tool today!',
    name: '2017-01-05-dat-next',
    raw: fs.readFileSync(path.join(__dirname, '2017-01-05-dat-next.md')).toString()
  },
  {
    date: '2016-12-18',
    title: 'Reader Privacy On The P2P Web',
    author: 'Max Ogden',
    teaser: 'Can we keep user metadata private when decentralizing data?',
    name: '2016-12-18-p2p-reader-privacy',
    raw: fs.readFileSync(path.join(__dirname, '2016-12-18-p2p-reader-privacy.md')).toString()
  },
  {
    date: '2016-11-11',
    title: 'Reflections from International Data Week 2016',
    author: 'Joe Hand',
    teaser: 'A summary of the Research Data Alliance event from September.',
    name: '2016-11-11-idw-2016-summary',
    raw: fs.readFileSync(path.join(__dirname, '2016-11-11-idw-2016-summary.md')).toString()
  },
  {
    date: '2016-11-11',
    title: 'An Introduction To Persistent Identifiers',
    author: 'Max Ogden',
    teaser: 'What I learned at PIDapalooza 2016.',
    name: '2016-11-11-pidapalooza',
    raw: fs.readFileSync(path.join(__dirname, '2016-11-11-pidapalooza.md')).toString()
  },
  {
  //  date: '2016-07-07',
    title: 'Announcing dat.land online demo',
    author: 'Karissa McKelvey',
    teaser: 'Live peer to peer sync in the browser with http://dat.land',
    name: '2016-07-07-announcing-dat-land',
    raw: fs.readFileSync(path.join(__dirname, '2016-07-07-announcing-dat-land.md')).toString()
  },
  {
    date: '2016-05-16',
    title: 'Key Elements of Distributing Data',
    author: 'Karissa McKelvey',
    teaser: 'How the current tools fall short by missing key elements.',
    name: '2016-05-16-key-elements',
    raw: fs.readFileSync(path.join(__dirname, '2016-05-16-key-elements.md')).toString()
  },
  {
    title: 'Dat 1.0 is ready',
    author: 'Karissa McKelvey',
    teaser: 'After years of R&D, the release candidate is ready.',
    name: '2016-02-01-dat-1',
    date: '2016-02-05',
    raw: fs.readFileSync(path.join(__dirname, '2016-02-01-dat-1.md')).toString()
  },
  {
    title: 'Announcing Publicbits.org',
    author: 'Karissa McKelvey',
    teaser: 'Breaking down open data silos with a new Knight Foundation grant.',
    name: '2016-02-01-announcing-publicbits',
    date: '2016-02-01',
    raw: fs.readFileSync(path.join(__dirname, '2016-02-01-announcing-publicbits.md')).toString()
  },
  {
    date: '2016-01-19',
    title: 'A Brief History of Dat',
    author: 'Max Ogden',
    teaser: 'History of Dat and the design choices over the last 2 years',
    name: '2016-01-19-brief-history-of-dat',
    raw: fs.readFileSync(path.join(__dirname, '2016-01-19-brief-history-of-dat.md')).toString()
  },
  {
    date: '2015-07-29',
    title: 'Dat goes beta!',
    author: 'Karissa McKelvey',
    teaser: 'After a long year of alpha testing, dat goes beta.',
    name: '2015-07-29-dat-beta',
    raw: fs.readFileSync(path.join(__dirname, '2015-07-29-dat-beta.md')).toString()
  },
  {
    date: '2015-04-03',
    title: 'Sloan Redoubles Dat Funding',
    author: 'Waldo Jacquith',
    teaser: 'Announcing a generous $640,000 grant from the Sloan foundation',
    name: '2015-04-03-sloan',
    raw: fs.readFileSync(path.join(__dirname, '2015-04-03-sloan.md')).toString()
  },
  {
    date: '2014-08-19',
    title: 'Announcing the Dat Alpha',
    author: 'Max Ogden',
    teaser: 'The first major version of dat along with a new website.',
    name: '2014-08-19-dat-alpha',
    raw: fs.readFileSync(path.join(__dirname, '2014-08-19-dat-alpha.md')).toString()
  },
  {
    date: '2014-04-02',
    title: 'Sloan funding Dat development',
    author: 'Waldo Jacquith',
    teaser: 'Announcing Sloans support of the dat project',
    name: '2014-04-02-dat',
    raw: fs.readFileSync(path.join(__dirname, '2014-04-02-dat.md')).toString()
  }
]
