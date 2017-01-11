# An Introduction To Persisent Identifiers
by [Max Ogden](http://maxogden.com)

This week in Reykjavik, Iceland I attended PIDapalooza, the first community conference dedicated to the topic of persisent identifiers (PIDs) for the scholarly web. As a relative newcomer to this community I wanted to share my experience diving in head first into this subject.

I also had the chance to give a presentation on possible uses of [public key cryptography in PID systems](https://github.com/maxogden/pidapalooza2016), an area that is very relevant to our work on the [Dat protocol](https://github.com/datproject/docs/blob/master/papers/dat-paper.pdf).

## What is a persistent identifier?

A [PID](https://en.wikipedia.org/wiki/Persistent_identifier) is just an ID that is persisted somewhere. For example, say I decided that the ID `1337` should point to my domain name maxogden.com. If I store this reference in an online PID archive that promises to never delete it, and promises to never give out ID `1337` to anyone else, then I can cite ID `1337` in an academic paper and trust that the librarians of the world will forever be able to resolve ID `1337` to my website.

If my website goes offline (say I forget to renew my domain), a librarian could in theory replace the reference to 'maxogden.com' with a new URL that points at an archived version of my site, so that when someone clicks the `1337` reference in my paper the link will still work. Please note that this is a purely theoretical scenario, I don't know how many PIDs actually address the 'link rot' problem by fixing broken links in this way.

## What are the different types of PIDs?

At PIDapalooza I learned about a few different PID implementations. Note this is not an exhaustive list!

### Digital Object Identifier (DOI)

[DOIs](https://en.wikipedia.org/wiki/Digital_object_identifier) are the most popular PIDs used in scholarly communications. For most researchers, DOI is the only PID they will use to cite things. A DOI looks like `10.1000/182` but is usually displayed in URL form like `https://doi.org/10.1000/182`. The `10.1000` is the organizational ID. Organizations wishing to issue DOIs pay an annual fee to issue DOIs to the DOI foundation and get assigned an organizational ID namespace number. When DOIs get resolved (see next section), they are the authority for resolving that namespace number. The `182` is the resource ID issued by the issuing organization. The idea is that issuing organizations should never issue the same resource ID twice. Numbers are preferred over words, as words tend to have cultural meaning that drifts over time whereas numbers are more librarian friendly.

To be allowed to create a DOI you have to be an issuing organization, pay an annual membership fee, and also pay around $1 per DOI you create, similar to a domain name except they are a one time fee.

The most popular registrar for DOIs for scholarly publication use cases is called [CrossRef](http://www.crossref.org/). CrossRef sells a DOI registration API as well as other value-add services for publishers. [DataCite](https://www.datacite.org/) is a ~5 person non-profit in the EU that promotes the use of DOIs to cite research data, and maintains and promotes a dataset schema that organizations can use when citing datasets.

Today the ~80 million DOIs and the resolution metadata that is stored in the Handle system for each one is stored in CrossRef and takes up about 40GB of space. In this way CrossRef centralizes the decentralized Handle DOI infrastructure to make it usable and exposes this data over various APIs but does not make the full DOI corpus easily downloadable.

### Handle System

The [Handle System](https://en.wikipedia.org/wiki/Handle_System) is a set of protocols designed in 1995 by [Bob Kahn of TCP/IP fame](https://gcn.com/Articles/2009/05/18/GCN-Interview-with-Robert-Kahn.aspx?Page=2) that are designed to manage a distributed set of persistent identifiers (handles) over IP. The DOI system is built on top of the Handle System. All DOIs are resolved through the Handle protocols, and DOI issuing organizations run Handle servers. The [Handle specification](https://tools.ietf.org/html/draft-sun-handle-system-04) defines the identifier format that DOI is based on: `Handle Naming Authority "/" Handle Local Name`.

Handle defines a custom binary protocol, used over TCP/UDP port 2641, making it incompatible with the World Wide Web as it doesn't use HTTP or DNS for both legacy and security reasons. However, the DOI system almost exclusively uses the Handle System through an HTTP proxy server https://hdl.handle.net that exposes the Handle protocol over a REST API. There is one implementation of Handle written in Java that everyone uses, but it is not on GitHub.

Handle allows a distributed group of providers, each one in charge of a separate prefix (e.g. the first part of a DOI), to register a public key with the Global Handle Registry (GHR) which is an authoritative service that manages, assigns and resolves requests to all prefixes. It's pretty much DNS, except designed in a time that the Web was not as dominant or flexible. It's unclear to me why it is still necessary to use Handle today other than for legacy reasons.

### ORCID

[ORCID](http://orcid.org/), funded by the same EU grant as DataCite and a spin-off of CrossRef, is a ~20 person non-profit that assigns DOIs to individuals and provides a searchable directory where you can access the profile for a researcher. They don't use DOIs but have their own identifier scheme [based on ISNI](https://en.wikipedia.org/wiki/ORCID) that look like `http://orcid.org/0000-0002-1825-0097`.

### Archival Resource Key (ARK)

John Kunze from California Digital Library designed [ARK](https://en.wikipedia.org/wiki/Archival_Resource_Key) as an alternative to DOIs that may be better suited for the needs of long term preservation and libraries, as opposed to DOI/Handle which arose out of the publishing/e-commerce industries.

The ARK system is free to use, as compared to DOIs which cost money to issue. ARK has a central prefix registry, run by the California Digital Library, which issues namespace prefix numbers similar to DOI. Other than this registry of prefixes institutions can issue and persist ARK identifiers and metadata for free to their own liking. This [means](https://groups.google.com/forum/#!topic/digital-curation/JtzVwVVCPvA) "You don't have to pay anyone, you just have to read the spec, get the institutional buy in, and start doing it.".

ARK URLs look like `http://bnf.fr/ark:/13030/tf5p30086k`, and are pretty similar to DOIs but not exactly the same.

### Decentralized Identifiers

This was my own idea, but you could in theory use a ED25519 public key as an identifier, removing the need for a central trusted namespace. If you add a resolution system where responses are signed by the key holder, and perhaps back the system by the PKI to solve the 'forgot my password' problem, you could build an identifier service that provides nice security guarantees without a [central point of failure](http://blog.crossref.org/2015/01/problems-with-dx-doi-org-on-january-20th-2015-what-we-know.html). In fact this is pretty similar to what we do in Dat (as Dat links are in fact ED25519 public keys and transmitted data is signed using this key).

**Update** I found this recent work called Decentralized Identifiers when Googling after writing this post: https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2016/blob/master/topics-and-advance-readings/did-spec-working-draft-03.md

## Link Rot

The commonly cited reason for using DOIs is to prevent link rot and/or content-drift. However, it is unclear to me how to measure the 'rotten-ness' of the DOI corpus. Herbert Von de Somple [presented at PIDapalooza about research](https://twitter.com/hvdsomp/status/796716360395059201) that analyzed HTTP links in published literature between 2007-2012 and found that around 10% of published links to the web are broken.

Based on my limited understanding of Handle metadata, a DOI is a one-to-many relationship that maps an identifier to some number of possible typed resources. In the case that the resource is a URL, there can be many matches. However I do not believe that the metadata includes any content fingerprint, e.g. a SHA2 hash of an Internet Archive .warc. So it is unclear to me how exactly the DOI system fixes link rot.

Some of my unanswered questions:

- How do DOI resolvers decide when it is acceptable to modify the metadata associated with the DOI in order to 'fix' link rot?
- Do all resolvers follow the same policy?
- If a resolver were to act maliciously, could they start returning false results without detection?
- Is there any version control for metadata over time, to see how different resolvers behaved at a certain point?
- How many resolvers use the cryptographic signing functionality offered by the Handle system?
- Do any resolvers integrate web capturing and content fingerprints to prove the link they fixed is the same content that the original DOI pointed at?
