Last week half the Dat team met up in Berlin. As a remote team (8 people, 4
countries) we mostly communicate through IRC and work asynchronously. This
means that whenever we meet up, we live, eat and hack together most of our
waking hours. This is a little summary of what we’ve been up to in the past
week.

## Dat Desktop team hangouts
Two weeks ago [Julian][julian], [Kriesse][kriesse] and [Yosh][yosh] released
the first version of [Dat Desktop][desktop]. While in Berlin, the Desktop team
met up and discussed some of the core roadmap for the Desktop app – ranging
from component systems to architecture and reliability. We’re excited to keep
lowering the barrier to entry for `dat`’s technology and are excited for what
the future holds!

## Hypercore v5 (SLEEP)
[Mafintosh][mafintosh] used the hacking time in Berlin to make the final
touches to [Hypercore][hypercore] v5. Hypercore is the core technology that
powers Dat. It’s an append-only log that operates on a flattened Merkle tree
and allows replicating data between peers with high speed and precision.
Version 5 introduces up to 100x speed improvement over v4, which means that
unlike most conventional systems the bottleneck becomes the network speed
rather than CPU or RAM. This is ideal for (partially) replicating data ranging
anywhere from single files to PetaByte scale\*. We think that’s pretty cool.

## 76 Döners
Okay, maybe not quite 76 Döners – but we had plenty of Turkish food. We care
deeply about checking out local specialties when we get the chance. Especially
if they’re as tasty as in Xberg. Yum.

## Choo v5 beta
Something great about spending time together is that you get to bounce ideas off
each other. In this case we took a good hard look at our current frontend
infrastructure and came up with a design that radically simplifies the way we
architect our websites. [choo v5][choo] is now in beta and brings a fresh
perspective to frontend development, being an uncompromising mix of simplicity
and performance. We hope you’ll enjoy it as much as we do.

## Wrapping up
We had a great time in Berlin. Between all the food, laughs and hanging out we
ended up being very productive and moving closer to our goals. We hope this
blog post sheds some light on what we’ve been up to, and are definitely looking
forward to the next time we hang out. Cheers! – The Dat Team

---

\* Sharing petaBytes of data has not been tested yet, even though it’s designed
to handle it. So far we’ve only gone to teraByte scale – hopefully someday
we’ll get to test `dat` on really big data sets ✨

[julian]: https://twitter.com/juliangruber
[kriesse]: https://twitter.com/kriesse
[mafintosh]: https://twitter.com/mafintosh
[yosh]: https://twitter.com/yoshuawuyts
[hypercore]: https://github.com/mafintosh/hypercore
[choo]: https://choo.io
[desktop]: https://github.com/datproject/dat-desktop
