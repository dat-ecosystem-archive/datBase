# Live peer to peer sync in the Browser
by [Karissa McKelvey](http://karissa.github.io)

Today we are happy to announce [dat.land](http://dat.land) -- a new browser-based demonstration of dat.

<iframe width="420" height="315" src="https://www.youtube.com/embed/w9er-XcZLCU" frameborder="0" allowfullscreen></iframe>

The new version of dat uses [hyperdrive](http://github.com/mafintosh/hyperdrive), a distributed filesystem that takes the best parts of data sync tools like DropBox or BitTorrent Sync -- but open source, peer to peer, and works in the browser.

Two months ago, I outlined the [7 key principles of a peer to peer data system](http://datproject.org/blog/2016-05-16-key-elements), which include signability, openness, history, content-addressability, decentralization, indexing, and streaming. This new version of dat in our browser based demo is the first iteration able to accomplish all of these key principles, and we are very proud of it.

## How it works

When the browser is opened, [dat.land](http://dat.land) generates what we call a "live" hyperdrive in the browser which is referenced by a public key, which looks like a bunch of random characters, like this:

```
be4d373dd847f3a138de926f939648f79d231de642b1fe88790d749c5693db14
```

This is same concept used in Google Drive and DropBox share links. This unique string of characters will identify your dat archive forever -- at least, as long as someone is broadcasting the key over the decentralized network.

If you share the new [dat.land](http://dat.land) link with someone else, their browser will attempt to find the other sources on the network that are broadcasting this same public key. Once it finds another source, it will attempt to connect directly to that other peer, and start downloading the data.

If you drag more data onto the screen, you'll notice that the data is automatically synced to the other browser. None of the source data is transferred through a central server. It is also encrypted end-to-end between browsers to prevent malicious third parties from reading the data without your permission. Only users you share the dat key with will be able to download your data.

## Implications

## Next steps
