# A Brief History of Dat
by [Max Ogden](http://maxogden.com)

We have some exciting news to share about Dat: We're working on a 1.0 release! It's not out just yet, but you can try what we have so far by checking out [the `master` branch on GitHub](https://github.com/maxogden/dat) or with `npm install dat@next -g`.

I'd like to explain the history of the project and the design choices over the last 2 years since the project started, as the project has made some pretty substantial changes in direction during that time. We have been in a constant cycle of R&D during this period, and have rewritten the Dat CLI four times.

Each rewrite incorporates the best modules and approaches from the last iteration and presents what we hope is a more straightforward workflow. We firmly believe this iterative process is the only way we could have arrived at the conclusions that led us to the features we are currently focusing on for our 1.0 release.

## Early Dat Prototype

The original use case for Dat centered around tabular datasets that change often. We wanted to make something to simplify the process of updating your copy of the data when the publisher updates the source data. The prototype version of Dat was built over the course of 6 months and was completed in Spring of 2014.

The prototype `dat` command-line tool only worked with tabular data and usage looked like this:

```sh
dat init
echo '{"hello": "world"}' | dat --json # put a JSON object into dat
cat some_csv.csv | dat --csv # stream a CSV into dat
echo $'a,b,c\n1,2,3' | dat --csv --primary=a # specify a primary key to use
dat cat # stream the most recent of all rows
dat push http://mydat.myserver.com:6461
```

In addition to `dat push` there was also `dat clone` and `dat pull`.

An example of the canonical use case we had in mind at the time was an Excel spreadsheet that gets published on an FTP server. We envisioned Dat as a tool that could sit between the user and the Excel spreadsheet and add fast + efficient syncing of new updates as well as version control features, neither of which are supported by Excel files natively.

## Dat Alpha

The Dat Alpha version was [released in August of 2014](https://usopendata.org/2014/08/19/dat-alpha/). The major feature we worked on was support for syncing large, non-tabular data files. This opened up a new use case: using Dat as a sort of 'DropBox for data' to sync a folder on your filesystem.

The Alpha release was the first release after starting on a new grant that shifted our focus from open civic datasets (which tend to be tabular -- e.g. lots of database tables) to the field of data intensive scientific research, which tends to use domain specific flat-file based data formats.

We worked directly, starting during the time of the Alpha and continuing on through to today, with some amazing research labs in fields like Astrophysics, Bioinformatics and Neuroscience to try and understand their data management problems. The addition of large file support in the Alpha was a direct result of getting feedback from these scientific pilot users.

With the Alpha CLI we attempted to support both the tabular *and* file syncing use cases, which increased the API surface area quite a bit:

```
dat cat
dat export
dat import
dat init
dat help
dat version
dat pull
dat push
dat clean
dat clone
dat serve
dat listen
dat blobs get
dat blobs put
dat rows get
dat rows delete
dat rows put
```

At this point in time we were very excited about the new file (AKA "blobs") syncing use cases, but unsure about the intuitiveness of the API that we had come up with. User testing during this period revealed that when given a choice between two workflows, new users got very confused and it made getting started more difficult.

To put your tabular data into version control you first have to know your schema, know your primary key (or come up with a composite primary key or use random unique IDs), and then build an import process that can be repeated when your source tabular data files change. This was a lot of work for users before they got to the gratifying parts like convenient push/pull/sync.

Also because we presented separate "row-oriented" and "blob-oriented" workflows, users had to be able to understand the tradeoffs of both before making a choice, further complicating the onboarding process and path to a first gratifying experience.

## Dat Beta

The Beta version [shipped in July of 2015](https://usopendata.org/2015/07/29/dat-beta/). The major focus was to make collaboration and reproducibility features possible by switching our internal data representation to a [directed acyclic graph](https://github.com/jbenet/random-ideas/issues/20). This means we can model fully decentralized workflows like pull requests on top of Dat, as well as offer versioning with cryptographic accuracy for entire datasets.

Up until this version Dat acted more like a traditional centralized version control system (CVS) such as Subversion where there is a central repository and all clients must synchronize with the central database before they can send any change they made.

The new DAG abstraction we developed during this time is called [hyperlog](https://github.com/mafintosh/hyperlog). It provides a graph storage API that supports incremental, streaming replication. We used it in the `dat` CLI tool as the core database, and added tabular import and file import + synchronization features on top of it.

In terms of command-line API, the beta didn't change too dramatically from the alpha. We still supported both tabular and file oriented workflows. We dropped the word 'blob' in exchange for 'files' and used terms like 'read' and 'write' instead of 'get' and 'put'.

The most notable new concept in the Beta was support for multiple datasets in a single repository. This was added to support datasets with hybrid data types, such as a astronomy full sky scan which might include raw image files from a telescope as well as tabular data created during post-processing of the images. You could model each one as a dataset in dat (sort of like two different sub-folders).

```
repository commands:
  dat init        Create a new dat.
  dat clone       Copy a dat to the local filesystem via http or ssh.
  dat push        Push data to a remote dat.
  dat pull        Pull data from a remote dat.
  dat checkout    Change view to a given version.
  dat serve       Start an http server.

descriptive commands:
  dat status      Show current status.
  dat log         List of changes.
  dat files       List all files.
  dat datasets    List all datasets.
  dat forks       List current forks.
  dat diff        See differences between the data in two forks.
  dat keys        List existing keys in a dataset.

data commands:
  dat import      Add tabular data to a dataset.
  dat export      View tabular data from a dataset.
  dat read        Read a binary file.
  dat write       Write a binary file.
  dat delete      Delete a key in a dataset.
  dat merge       Merge two forks into one.
```

At the time of the Beta release we were most excited about the new decentralized possibilities. We were still unsure about the intuitiveness of the API, but weren't sure how to simplify the API without dropping support for use cases we thought were important.

## Dat 1.0

We are still working on the official Dat 1.0 release, but you can try out the 1.0 RC (release candidate) today.

After testing the alpha and beta extensively we realized we had to reduce the scope of Dat in order to make it intuitive to use. One thing we have learned through this process is that the most difficult part of designing software is finding the natural API. Once we know what we want to build actually building it is the easy part.

In our case we were torn between a tabular data workflow (importing CSVs row by row, re-importing CSVs when individual rows are edited, with key/value database semantics) and a file based workflow (like Dropbox or rsync where we are agnostic to the actual contents and format of the files).

We decided a "files-first" approach is the way forward. Modeling more complex tabular data workflows on top of Dat is still possible, but we are treating it as an advanced use case. As a result, the new 1.0 command-line API looks like this:

```
$ dat link
# prints share link
$ dat <share-link>
# downloads data
```

We were able to get rid of 90% of our previous API surface area by going lower level (files-first).

This blog post would be too long if I took the time to list the reasoning behind the removal of all of the commands from the Beta version. [Thankfully, we did a talk about just this redesign late last year](https://vimeo.com/147914258), which you can watch below. The short answer is that we decided to try and focus on making something that was as easy to use as Dropbox (but open source and peer to peer), and that specific focus allowed us to streamline quite a bit. As I said above, the hard part was going through the process of trying different approaches until we could feel confident in committing to one of them.

<iframe src="https://player.vimeo.com/video/147914258" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/147914258">Designing Dat 1.0</a> from <a href="https://vimeo.com/ropensci">ropensci</a> on <a href="https://vimeo.com">Vimeo</a>.</p>


I hope this was insightful, and please try out the new Dat and let us know what you think!
