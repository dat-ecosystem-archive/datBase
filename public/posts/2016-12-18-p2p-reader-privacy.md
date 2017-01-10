# Reader Privacy On The P2P Web
by [Max Ogden](http://maxogden.com)

### Vendor Lock-In

The Peer-to-peer Web is a way of thinking about distributing web content over the internet that doesn't rely on a central point of failure. Failure sometimes means the service disappears (like the Dropbox Public folder this week). Another type of failure is failure to scale due to a bottleneck. A good example of this is data infrastructure like Amazon S3 and Google Drive. By storing all your data in one place they create a bandwidth bottleneck that they then make you pay for. For a primer on the P2P web principles I recommend the post [What is the P2P Web?](http://pfrazee.github.io/blog/what-is-the-p2p-web) To quote that article, "Once integrated into a browser, these principles enable users to publish independently of services, and move between applications freely".

To me the P2P web distinguishes itself from the web today by putting the user in control of their data. The web has long been about open standards for building cross platform applications like HTML, CSS and JavaScript, but falls short of providing a standard way for a user to control their online presence and data, e.g. being able to export their account from one application to another or use services like GMail without letting Google read their emails. Instead the web we have today becomes more and more siloed as large advertising based companies like Facebook and Google are incentivized to get us to give them more and more of our data. They have no incentive to let users easily export their data to or cohabitate their account with other competing services, so such mechanisms for putting the user in control of where their data lives never get built.

Users should be able choose where their data lives and who has access to it. Ultimately the P2P web is about giving users a choice based on their level of trust. On the web today the choice is binary, basically "their way way or the highway". If you sign up for and use a service like Facebook, you are trusting Facebook as the steward of your data. Your only other choice is to never sign up. They don't provide you with a way to happily sync your Facebook account with all its data in realtime into other competing services over an open protocol, so if Facebook decides one day that they are going to stop hosting your old Instagram photos (like Twitter is currently doing with Vine), it becomes a scramble for users to back up their data before it gets deleted forever.

### User Privacy and Trust

Today's advertising based services have these incentives:

- 1: Acquire more user data (for advertising)
- 2: Keep users data and privacy protected, as long as it doesn't hinder #1

Having all our data stored in one physical location is obviously bad if the service disappears or is hacked into and leaked online or secretly subpoenaed by the government. For this post let's set the issue of long term storage privacy aside and instead focus on on reader privacy. 

Reader privacy means protecting the privacy of what a user is looking at. For example, if you walk into a library and ask the librarian to help you find a certain book, most librarians are morally obligated to keep what book you asked for a secret. Similarly, therapists and lawyers also protect the privacy of conversations with their clients. If someone were to follow you, they could figure out that you're visiting a library or a lawyers office, but they wouldn't know what you are talking about.

Reader privacy is possible online thanks to HTTPS. When you go to sites like facebook.com or wikipedia.org, people who hack into your traffic can see that you're visiting those domains but that's it. They can't tell which Facebook profiles or Wikipedia pages you are reading, because the traffic between you and those sites is encrypted. For sites like Archive.org, which is an online digital library run by librarians, reader privacy is a deeply held value.

Thanks to HTTPS most centralized services on the web can do a pretty good job at ensuring that adversaries like man-in-the-middle hackers or the NSA can't easily perform mass surveillance and figure out what we're all doing online (at least at the time we are browsing).

The nice feature of the model where users trust a single centralized service with all their data is that it is very simple to understand from the users perspective. They only have to connect to and trust one entity online. As long as they don't get phished, they just have to look for the green lock icon next to 'facebook.com' and they can be sure their connection cannot be monitored by anyone other than facebook.com.

### Decentralization vs. Reader Privacy

In most P2P systems you trust not one centralized remote server but a set of remote "peers". The idea being that any peer that speaks a compatible P2P protocol can be discovered and act as a server if they have information you want. It's possible you'll search for and discover many peers when using a P2P service.

BitTorrent clients for example search a single global network (the BitTorrent DHT) to find IP addresses of peers who claim to have data that the client is searching for. For this reason BitTorrent has **very poor** reader privacy, almost none at all. If you want to perform mass surveillance to find out what IP addresses are searching for and downloading torrents, you simple run a honeypot server on the DHT that advertises that it has every torrent from popular torrent tracker sites. Soon you will be inundated with requests for the data you claim to advertise, but you can simply log all the IPs you see and ignore their requests for data.

In this way BitTorrent trades bandwidth for reader privacy, which is an inherent tradeoff in P2P systems. In order to create the largest swarms possible and use as much bandwidth as possible, BitTorrent does not include a mechanism for protecting the privacy of what a BitTorrent client is looking for. If we were to naively host public websites using BitTorrent it would be difficult to protect for example what Wikipedia pages are being read by a certain IP.

### P2P Web Privacy Modes

You can break down privacy/trust tradeoffs on the P2P web into three categories:

- Trust everyone - Bad reader privacy. Ask anyone in the world, trust that none of them will use the information in your query against you.
- Trust a single source - Good reader privacy. You only trust one entity online. How the web mostly works today, you trust whoever owns the SSL certificate.
- Web of Trust - You trust a set (e.g. whitelist) of entities to keep your query private. Could work in e.g. academic settings where you have services hosted by reputable public institutions.

In the context of Dat, a file sharing tool that wants to support good reader privacy but also take advantage of bandwidth and redundancy gains from decentralization, the Web of Trust model is very interesting. For example we could have clients trust any verified academic data library (e.g. ones hosted at verified public Universities) to preserve reader privacy. That way Dat clients could still connect to many fast sources around the world and get fast and cheap bandwidth for their data transfers, without having to expose what they are searching for to any random unverified IP address like how BitTorrent works.

In a Web of Trust model you are trusting a set of entities. One entity could still turn evil later and start logging or leaking your search queries, but this is part of the unavoidable tradeoff of trust vs. decentralization. Our goal with Dat is to provide a way to curate, distribute and revoke entities from secure "Web of Trust" manifests, so that if a bad actor needs to be removed it can be done so in a way that clients can automatically subscribe to a feed of revocations and additions. SSL certificates have a similar issue, which is being addressed by projects like Certificate Transparency.

This will allow us to build a dataset registry that can help connect users wanting to privately search for datasets and the sources online that have those datasets. As long as you trust the registry, and the registry trusts all of the sources to maintain reader privacy, a client can use the registry as a sort of anonymous proxy to find trusted data mirrors and then privately and securely introduce them such that an outside mass surveiller wouldn't be able to deduce what dataset is being searched for or downloaded.

### In Summary

P2P systems can address issues around data silos and vendor lock in that prevent users from being in control of their data and putting user data at risk of large data hacks and leaks, but they can also be a double edged sword that sacrifices reader privacy if trust models around peer discovery are not carefully considered.

Do you have another approach to reader privacy in P2P systems? Share a link we can read to @dat_project on Twitter
