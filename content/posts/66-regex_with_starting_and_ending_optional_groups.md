---
title: "Regular expressions with optional starting or ending groups" 
date: 2022-02-10T10:29:34+01:00
draft: false
author: "Edwin Wenink"
tags: ['regex', 'programming', 'NLP']
---

I'm currently working on a classifier that can extract punishments from Dutch criminal law decisions.
One of those punishments is called "TBS", which is assigned in severe cases where it is shown that the suspect was under the influence of a psychiatric condition at the time of committing the crime.

There's two types of TBS in the Netherlands: with "verpleging" (mandatory psychiatric treatment) and with "voorwaarden" (several conditions).
We want to match "terbeschikkingstelling" (TBS), but if the type of TBS is specified, we want to capture that too.

We want to match the following test strings:

- "de maatregel van terbeschikkingstelling wordt aan de verdachte opgelegd."
- "de maatregel van terbeschikkingstelling met voorwaarden te gelasten."
- "de maatregel van terbeschikkingstelling met verpleging van overheidswege te gelasten."

In these test cases, the type of TBS is mentioned at the end of the match and is optional.

A fully naive first attempt to tackle this problem could be as follows:

```
(terbeschikkingstelling).*(voorwaarden|verpleging)?
```

But this will match "terbeschikkingstelling" but *not* "verpleging" because of the "dot star soup" (expression I found and liked on rexegg.com).
Because the ending group is optional, `.*` will consume until the end of the string and be happy.

I've actually never used regular expressions outside of trivial situations, so I had to go back and study them a bit to find a better solution to my problem
(shout out to [rexegg.com](https://www.rexegg.com/)!).

Essentially, we want the  "dot star" to expand until we encounter "verpleging" or "voorwaarden", but no further, and then capture "verpleging" or "voorwaarden".
That is, we want to match any token (`.`) that is *not followed* by "verpleging" or "voorwaarden", making these words essentially function as delimiters that restrict the scope of the greedy quantifier.
This is done with a *negative lookahead*, which looks like this `(?!)`.
This ensures that the pattern does *not* occur after the position the regex engine is currently matching. 

Let's first apply this idea to only one of the alternatives: `(?!voorwaarden).`.
We want to repeat this zero or more times, so we wrap this in a non-capturing group and apply the greedy star quantifier:

```
(?:(?!voorwaarden).)*
```

Now the scope of the star is limited, because it will stop matching once "voorwaarden" is found.
In this case we actually want to capture "voorwaarden."
Because we know the star will stop matching right before "voorwaarden", we can safely gobble up "voorwaarden" as a literal match:

```
(?:(?!voorwaarden).)*(voorwaarden)
```

In this case, "voorwaarden" is still a required match.
But the crux is that now we can safely make the ending group optional, because we've scoped the greedy quantifier and prevented it from gobbling up our optional group at the end!

```
(?:(?!voorwaarden).)*(voorwaarden)?
```

Note that with an optional group at the end, we cannot make the star quantifier lazy (`*?`) because then the regex will never try to find the optional ending group (yep, it's *really* lazy!).

Now we finish up by including the second alternative.
The whole regex becomes:

```
(terbeschikkingstelling)(?:(?!voorwaarden|verpleging).)*(voorwaarden|verpleging)?
```

The only thing left to do is to think a bit about what happens when "voorwaarden" or "verpleging" does *not* occur in our input string.
We need to design for failure.
If the optional group is absent, the regex will always match until the end of the input string.
In my particular problem that's quite bad, because I'm feeding the regex whole paragraphs of text at once.
We can use a bit of domain knowledge here though, because the further specification of the type of TBS will always occur in a short window after the main punishment is mentioned.
So an easy solution would be to explicitly specify the window in which we will look for the type specification, let's say within 100 characters:

```
(terbeschikkingstelling)(?:(?!voorwaarden|verpleging).){0,100}(voorwaarden|verpleging)?
```

The test cases will now return the following groups:

```
"de maatregel van terbeschikkingstelling wordt aan de verdachte opgelegd."

-> group 1: terbeschikkingstelling

"de maatregel van terbeschikkingstelling met voorwaarden te gelasten."

-> group 1: terbeschikkingstelling; group 2: voorwaarden

"de maatregel van terbeschikkingstelling met verpleging van overheidswege te gelasten."

-> group 1: terbeschikkingstelling, group 2: verpleging
```

### Diving deeper into the use case

Let's take some actual test cases where TBS is imposed in Dutch law: 

- "gelast de terbeschikkingstelling van verdachte, met verpleging van overheidswege" (ECLI:NL:RBZWB:2020:6268).
- "gelast dat de verdachte, voor de feiten 2, 3 en 4, ter beschikking wordt gesteld en stelt daarbij de volgende, het gedrag van de ter beschikking gestelde betreffende, voorwaarden" (ECLI:NL:RBLIM:2020:9778).
- "De rechtbank verlengt de termijn van de terbeschikkingstelling van veroordeelde met één jaar" (ECLI:NL:RBNNE:2020:4558).
- "verlengt de termijn gedurende welke [verdachte] ter beschikking is gesteld met verpleging van overheidswege met één jaar" (ECLI:NL:RBLIM:2020:10468).

We first recognizes that there are alternative formulations like "ter beschikking is gesteld" and "ter beschikking wordt gesteld," so we adjust the regex for that.
We also allow "terbeschikkingstelling" to be written as "ter beschikking stelling" and include "TBS" as the relevant abbreviation.

```
(TBS|terbeschikkingstelling|ter beschikking (?:wordt |is )?(?:stelling|gesteld))(?:(?!voorwaarden|verpleging).){0,100}(voorwaarden|verpleging)?
```

Now, there is a subtlety: legal jargon related to "ter beschikking stellen" does not necessarily indicate TBS but can also relate e.g. to goods.
If we really want to make sure these phrases relates to TBS (i.e. avoid false positives) we should probably make the ending group non-optional after all. 
However, this means we do not match cases where TBS is assigned in the past, but is now prolongated such as in "verlengt de termijn van de terbeschikkingstelling."
The type of TBS is not specified here because it has already been determined in a previous judgement.
So our new problem statement could be: we think a TBS-punishment is assigned either when it is preceded by an indication of prolongation such as "verlenging" or when the type of TBS is explicitly specified (with "voorwaarden" or "verpleging").

Let's again decompose the problem and solve the case where "verlenging" occurs *before* the indication of TBS.
We again want to design a delimiter, but now one that determines where to *start* matching instead of where to end.
We can express that we only want to start matching after having seen either "verlenging" or "verlengt" with a *positive lookbehind* on "verleng":

```
(?<=verleng).*?
```

But since we know where to begin matching and we'd like to also capture "verlenging", we can just anchor the start with a literal match:

```
(?P<verlenging>verlengt|verlenging).{0,50}(?P<TBS1>TBS|terbeschikkingstelling|ter beschikking (?:wordt |is )?(?:stelling|gesteld))
```

Combining everything we get a quite lengthy regex with two alternatives.
Either we require something like "verlenging" in front of the regex, or something like "veroordeling" or "voorwaarden" after.
The ending group is now no longer optional:

```
(?P<verlenging>verlengt|verlenging).{0,50}(TBS|terbeschikkingstelling|ter beschikking (?:wordt |is )?(?:stelling|gesteld))|(TBS|terbeschikkingstelling|ter beschikking (?:wordt |is )?(?:stelling|gesteld))(?:(?!voorwaarden|verpleging).){0,100}(voorwaarden|verpleging)
```

By using this alternation, we have to repeat the regex for the TBS part.
I also find this a bit annoying, because if I want to do something with the "TBS" part downstream it can either be in the second or third capture group.
On average, this also increases the number of steps the regex engine has to traverse.

We can also change our mindset: instead of only matching what we want to keep, we can capture all relevant components and throw away matches we don't want downstream.
For example, we can get rid of the alternation and just have optional groups both at the beginning and end.
The only thing we then have to do is filter out matches that have neither of the optional groups.

The regex with two optional groups, both at the beginning and the end, could look like this:

```
(?:(?P<verlenging>verlengt|verlenging).{0,50})?(TBS|terbeschikkingstelling|ter beschikking (?:wordt |is )?(?:stelling|gesteld))(?:(?!voorwaarden|verpleging).){0,100}(voorwaarden|verpleging)?
```


Test case 1: "gelast de terbeschikkingstelling van verdachte, met verpleging van overheidswege" (ECLI:NL:RBZWB:2020:6268).

```
match: terbeschikkingstelling van verdachte, met verpleging
group 2: terbeschikkingstelling
group 3: verpleging
```

Test case 2: "gelast dat de verdachte, voor de feiten 2, 3 en 4, ter beschikking wordt gesteld en stelt daarbij de volgende, het gedrag van de ter beschikking gestelde betreffende, voorwaarden" (ECLI:NL:RBLIM:2020:9778).

```
match: ter beschikking wordt gesteld en stelt daarbij de volgende, het gedrag van de ter beschikking gestelde betreffende, vooraarden
group 2: ter beschikking wordt gesteld
group 3: voorwaarden
```

Test case 3: "De rechtbank verlengt de termijn van de terbeschikkingstelling van veroordeelde met één jaar" (ECLI:NL:RBNNE:2020:4558).

```
match: verlengt de termijn van de terbeschikkingstelling van veroordeelde met één jaar
group 1: verlengt
group 2: terbeschikkingstelling
```

Test case 4: "verlengt de termijn gedurende welke [verdachte] ter beschikking is gesteld met verpleging van overheidswege met één jaar" (ECLI:NL:RBLIM:2020:10468).

```
match: verlengt de termijn gedurende welke [verdachte] ter beschikking is gesteld met verpleging
group 1: verlengt
group 2: ter beschikking is gesteld
group 3: verpleging
```

Some final notes: 

- In this setup, not making `(voorwaarden|verpleging)?` optional leads to large inefficiency if the group is not in the string. It will cause the lookahead to be repeated a lot in an attempt to still find the group.
- Downstream we may opt to reject the match if neither of the optional groups is matched, because this may be a false positive. The upside is that this gives flexibility in your application without having to redesign the regex. As we see in the last test case, it may also be that *both* groups are present as we see in test case 4.
- There are other edge cases to catch for detecting TBS. I only consider a few test cases to keep things simple.

Please let me know if you see points where I can improve (e.g. in terms of optimization)!

Related note: [index regex](/zettelkasten/index_regex.md).
