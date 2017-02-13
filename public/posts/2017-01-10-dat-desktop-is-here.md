Today we’re announcing the release of Dat Desktop, a peer to peer data sharing app built for humans.

![Screenshot of Dat Desktop](/public/img/screenshot-dat-desktop.png)

Dat is a new way to share data over the distributed web.
It makes sharing folders on your computer secure and convenient. It's open source and non-profit, unlike BitTorrent Sync and doesn't send your raw unencrypted data to any servers to be sold or surveilled, unlike DropBox.

## Try It Out

You can [download the latest Dat Desktop release here.][https://github.com/datproject/dat-desktop/releases]. It's

To get started, hit 'Create new Dat' and choose a folder that you want to share.

![Screenshot of Dat Desktop](/public/img/screenshot-dat-desktop.png)

A Dat link will be created that you can share with someone else using the desktop app, the [commandline tool](http://docs.datproject.org), or [Node.js library](http://github.com/datproject/dat-node). The two computers will look for eachother and the data will be sent directly between the two computers securely with end-to-end encryption.

Dat and Dat Desktop use the Node.js library Hyperdrive, developed by [Mathias Buus (mafinotsh)](http://github.com/mafintosh/hyperdrive) with support from the [Sloan Foundation](http://codeforscience.org). It has been designed to efficiently share terabytes of of scientific data in real time between research institutions on multiple continents, but it works fine to share text files on the local network too. Learn more about [how dat works here](https://docs.datproject.org/how-dat-works).

## Updating Dat Desktop

You only have to install Dat Desktop once - we’ll make sure you’ll always be running the latest and greatest. Some of the features to come include:

- preview modes for a wide range of data formats
- tagging, versioning and snapshotting of Dats
- publishing Dats with shortnames to a GitHub-style Dat Registry and Dat Cloud
- forever improving stability and performance

## Give Feedback and Contribute

Dat Desktop is currently under heavy development and moves fast – your feedback helps us to improve. Found a bug, got a question? [Open an issue on
GitHub][issues], reach us [on Twitter][twitter] or drop by on
[Freenode#dat](https://webchat.freenode.net/).

---

We hope you have as much fun using Dat Desktop as we do building it!

[download]: https://download.datproject.org
[source]: https://github.com/datproject/dat-desktop
[issues]: https://github.com/datproject/dat-desktop/issues
[twitter]: https://twitter.com/dat_project
