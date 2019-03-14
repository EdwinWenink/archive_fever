---
title: "War and terrorism in the cyber domain"
author: "Edwin Wenink"
date: 2019-03-15
draft: false
tags: [hack, ransomware, war, terrorism, cyber, security, philosophy]
---

[This CSO article](https://www.csoonline.com/article/3345967/is-the-world-ready-for-the-next-big-ransomware-attack.html) reports on a massive ransomware attack with NonPetya that is estimated by CyberReason research to have costs businesses globally [around 1.2 billion dollar](https://www.cybereason.com/blog/notpetya-costs-companies-1.2-billion-in-revenue).

One paragraph in particular caught my eye:

> To complicate matters, having cyber insurance might not cover everyone’s losses. Zurich American Insurance Company refused to pay out a \$100 million claim from Mondelez, saying that since the U.S. and other governments labeled the NotPetya attack as an action by the Russian military their claim was excluded under the “hostile or warlike action in time of peace or war” exemption.

You can read the official U.S. press release [here](https://www.whitehouse.gov/briefings-statements/statement-press-secretary-25/). 
What interests me is not just the small letters of insurances policies, although they can have huge financial consequences for companies in this case.
Philosophically and politically, the more interesting question is what constitutes an act of war in the cyber domain.
In this scenario, insurance money is paid based on whether the cyber attack is considered a warlike act or not.
The phrasing "warlike action in time of peace or war" anticipates a difference between such warlike attacks and "actual" war, as these "warlike" acts do not have to take place during war time.

Traditionally, wars occur between two nations that are identifiable.
If they play fairly, they can even officially declare war before knocking on someone's door. 
It is important that these parties are identifiable, so that they can be held accountable in terms of the Geneva Conventions for example.
However, in the case of cyberattacks, there can be significantly more ambiguity concerning the identity of the attacker.

Take for example a well known cyberattack on DigiNotar, a certificate authority in the Netherlands (for public key encryption). 
Due to a hack fake certificates had been issued, compromising the trustworthiness of DigiNotar certificates, resulting in the removal of these certificates for example from all major browsers. 
To complicate matters, the Dutch government internally used many DigiNotar issued intermediary certificates that chained up to the Dutch government CA itself (see for example [Firefox' communication about this](https://blog.mozilla.org/security/2011/09/02/diginotar-removal-follow-up/).
The DigiNotar certificates becoming untrusted consequentially threatened to destabilize the Dutch government, as official services such as the tax system and the online ID management system for Dutch citizens (DigID) that is used to access government services threatened to become inaccessible. 
In other words, the hack was a threat to the stability of the Dutch state.
Is this a warlike act? Or is it an act of war?

Interestingly a presumably Iranian hacker claimed the attack [here](https://pastebin.com/1AxH30em) and stated that his motivation was political: revenge for the Srebrenica massacre the part the Dutch government played in it. 
It seems then that destabilizing the Dutch government was not just a side-effect, but a direct target of the attack.
One can wonder how convincing is it that such a young person would successfully perform a hack on a major certificate authority all by himself. 
Especially when one hypothesizes about government involvement and if one takes into account that the target of the attack was announced to be the Dutch government, then this attack can potentially be interpreted as an act of war.

The following quote from [here](https://www.computerworld.com/article/2507509/comodo-hacker-claims-another-certificate-authority.html) argues against jumping to such conclusions:

> "Security expert Robert Graham, who's swapped e-mails with Ich Sun and ultimately confirmed that he was indeed the one who pulled off the Comodo hack, thinks otherwise. He accuses Comodo and reporters who have covered this story of jumping to conclusions about the Iran connection. "We make the assumption that anyone who supports the government there works for the government and that's just not true," said Graham, CEO of Errata Security. "My theory is he's exactly what he says he is. That's what the evidence points to. There's no evidence that says he would have to be part of a state-sponsored effort. The attack is not that complex. It's just what your average pen-tester would do."

Interestingly, the later investigation report by Fox-IT which can be downloaded [here](https://www.rijksoverheid.nl/bestanden/documenten-en-publicaties/rapporten/2011/09/05/diginotar-public-report-version-1/rapport-fox-it-operation-black-tulip-v1-0.pdf) from a Dutch government website showed that "Around 300.000 unique requesting IPs to google.com have been identified. Of these IPs \>99% originated from Iran" (p. 8). 
It turned out that practically all victims of the attack on a Dutch certificate authority where in fact Iranian gmail users. 
The target then was not the Dutch government after all. The Dutch certificates were used for a massive man-in-the-middle attack on Iranian civilians.

The take-away is that calling something an act of war in the cyber domain is to some extent a matter of interpretation as the relevant actors become increasingly less identifiable.
That act of interpretation however has huge potential consequences.
In the context of the cited article those consequences are mostly economical for companies whose damages might not be covered by their insurance. 
But the potential *political* consequences are the most worrisome. 
As digital systems become more interwoven with essential infrastructures and with other digital systems, warfare will also become increasingly digital.
In accordance, those with the knowledge and capabilities to work and influence computer systems de facto have political power.
And when the relevant parties of "warlike" acts in the digital domain cannot be identified anymore as government parties, the distinction between war and terrorism blurs, as the distinction heavily relies on the violence of the former being warranted *by* a nation, whereas that of the latter is *against* a state or nation.

This made me remember a reflection of Derrida on how technoscience blurs the rigorous distinction between war and terrorism, in a book I have read about five years ago (it made an impression apparently). 
I looked it up again, this passage is from the book "Philosophy in a Time of Terror" (2003) by Giovanna Borradori. 
In the words of Jacques Derrida:

> No geography, no "territorial" determination, is thus pertinent any longer for locating the seat of these new technolgies of transmission or aggression. To say it all too quickly and in passing, to amplify and clarify just a bit what I said earlier about an absolute threat whose origin is anonymous and not related to any state, such "terrorist" attacks already no longer need planes, bombs, or kamikazes: it is enough to infiltrate a strategically important computer system and introduce a virus or some other disruptive element to paralyze the economic, military, and political resources of an entire country or continent. And this can be attempted from just about anywhere on earth, at very little expense and with minimal means. The relationship between earth, *terra*, territory, and terror has changed, and it is necessary to know that this is because of knowledge, that is, because of technoscience. It is technoscience that blurs the distinction between war and terrorism. (p. 101)

