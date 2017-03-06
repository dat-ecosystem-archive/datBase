# Berlin Hack week
Last week half the Dat team met up in Berlin, where 2 members are based out of.
As a remote team (8 people, 4 countries) we mostly communicate through IRC and
work asynchronously. This means that whenever we meet up, we live, eat and hack
together most of our waking hours. This is a little summary of what we've been
up to in our week in Berlin.

## Discussed & planned the direction of Dat Desktop
Two weeks ago [Julian][julian], [Kriesse][kriesse] and [Yosh][yosh] released
the first version of Dat Desktop. While in Berlin, the Desktop squad met up and
discussed some of the core roadmap for the Desktop app - ranging from component
systems to architecture and reliability. We're excited to keep lowering the
barrier to entry for `dat`'s technology and are excited for what the future
holds!

## Hypercore v5 (SLEEP)
[Mafintosh](https://twitter.com/mafintosh) used the hacking time in Berlin to
make the final touches to [Hypercore](https://github.com/) v5. Hypercore is the
core technology that powers Dat. It's an append-only log that operates on a
flattened Merkle tree and allows replicating data between peers with high speed
and precision. Version 5 introduces up to 100x speed improvement over v4,
which means that unlike most conventional systems the bottleneck becomes the
network speed rather than CPU or RAM. This is ideal for (partially) replicating
data ranging anywhere from single files to PetaByte scale\*. We think that's
pretty cool.

## 76 Doners
Okay, maybe not quite 76 Doners - but we had plenty of Turkish food. We care
deeply about checking out local specialties when we get the chance. Especially
if they're as tasty as in Xberg. Yum.

## Choo v5 beta

## 

\* Sharing petaBytes of data has not been tested yet, even though it's designed
to handle it. So far we've only gone to teraByte scale - hopefully someday
we'll get to test `dat` on really big data sets ✨
