# Key Elements of Distributing Open Data
by [Karissa McKelvey](http://karissa.github.io)

The data distribution toolkit has become a mixed bag of tools that require different skill sets and are applied for different purposes. Git, for example, is a tool that works effectively for governing data (if you learn how to use it), but it quickly becomes unwieldy for larger datasets. BitTorrent is a great solution for distributing large datasets across many machines, but torrent files are static, and can become a hassle to use with changing data. BitTorrent Sync, DropBox, and Google Drive attempt to solve this problem, but they are proprietary software that fall short when it comes to governing data amongst teams or for the public eye. Data portals like Socrata, CKAN, or are custom built employ HTTP/FTP plus a good metadata file (and a hearty group of helping hands) and continue to be the most used method for publishing open data.

All of these tools mentioned above have some of the key elements for open data distribution, but none of them have them all -- and this is why, I argue, they all fall short. These key elements are: open, streaming, historical, content-addressable, signable, indexable, and decentralized. In this blog post I’m going to cover each of these key elements and talk about why they’re important as well as what they offer us when attempting to distribute data to the public. I will also introduce the newest version of our tool, Dat, which contains all of these elements.


| | signable | open | historical | content-addressable | decentralized | indexable | streaming |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Socrata | x |   |   |   |   |   |   |
| CKAN | x | x | x |   |   |   |   |
| FTP | x | x |   |   |   | x |  x |
| HTTP | x | x |   |   |   | x | x |
| DropBox/Drive | x |   | x |   |   | x | x |
| BitTorrent Sync | x |   |   | x | x | x | x |
| Git | x | x  | x | x | x |   |   |
| Dat |  x | x | x | x | x | x | x |




**Open.** An open data tool should be open source. This isn’t simply out of principle -- it also enables developers to tweak the tool for use within a potentially complicated distribution system. This property is key for extensibility and stability of any distribution toolchain by not requiring dependence upon outside proprietary and corporate software. Most importantly, developers can peer review, or audit, the tool for reliability and safety. *Benefits: developer-friendliness, extensibilty, long-term stability.*

**Historical.** Data should be versioned with cryptographically secure hashes. We can then prove the data is exactly what we need when we reference a particular version in scripts or analysis results. We can also audit the history of the data, which could be key for understanding errors in the data transformation or distribution pipeline. *Benefits: auditing, governance, provenance.*

**Decentralized.** Data that is decentralized enables each user to have a complete copy of the data and its history. Then, data be manipulated locally before being re-published, either as a fork or as an update to the original dataset. As data is downloaded, it is served, reducing bandwidth and increasing efficiency as more people download data. When the original server goes offline, the data could still be available through the peer network, increasing the likelihood that the open data will be around as long as possible. If decentralized and versioned, the tool must use data structures that guarantee the data can be trusted even across many computers. That means using a decentralized tree called a merkle directed acyclic graph, what we find in Git, Blockchains, and other popular decentralized applications.  *Benefits: bandwidth, uptime.*

**Content-addressable.** Each file should be split into chunks that are stored in the filesystem under a content-addressable scheme, so that all identical chunks are only downloaded once. This increases speed when downloading datasets that often repeat chunks of data, or when downloading new versions of a dataset that only have slight changes. *Benefits: bandwidth, storage.*

**Signable.** Also known as authentication, each repository should be able to have an ‘owner’ that can prevent global editing of the dataset. This allows us to guarantee the integrity of the dataset by only allowing trusted users to edit and add data. *Benefits: security, collaboration, governance.*

**Streaming.** A client should be able to retrieve data chunks immediately instead of being forced to download the entire contents of a dataset before reading. This also allows clients to listen to changes and update as soon as new data is published. *Benefits: live file syncing, live audio/video streaming, instantaneous upload/download.*

**Indexable.** The tool will allow a client to download a particular byte range of a file. *Benefits: random access seeking, file indexing (e.g., rows in a csv).*

Our newest version of [dat](http://github.com/maxogden/dat) is a working implementation of these key elements. Check out the [GitHub repository now](http://github.com/maxogden/dat) to get started or see the [online demo](http://dat.land). We are also always available in IRC, #dat on freenode, for questions, comments, or suggestions.

**edit**: [See the discussion on hacker news](https://news.ycombinator.com/item?id=12020422)
