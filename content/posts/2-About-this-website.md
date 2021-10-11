---
title: "About this website"
date: 2018-04-05
tags: ["website","DIY"]
draft: false
author: "Edwin Wenink"
series: ['Website']
---

This website emerged from a DIY attitude, which translates as: I have been working with raw material, without having pre-existing knowledge about proper style for either html, css, or javascript etc. 
I could also not be bothered to read up on theory first, since this was a project for leisure time (to avoid working on other things, basically).
I started with a single page website with some html and css, and over the course of a half year I kept adding features and something resembling actual content to the page. In the meantime I was building forth on questionable and quite intractable css classes of course, often resulting in me losing oversight. The maniacal stream of git commits in the repository of this website testifies to this. 

Lately I have been getting into markdown based workflows, for example as a way to replace writing lengthy LaTeX markup for university work or fancy notes. I figured that if one day I would start using this website for promoting actual content, as opposed to using it for intellectual masturbation - "look here is this webpage with my name on it" - then I would definitely want to push content written in markdown, from the comfort of my preferred working environment: the nerdy vim editor in the self-contained universe of my tiling terminal. 

At the same time, I wanted to keep things basic and retain control over all aspects of my website. Self-maintainance is key for me: this whole thing has to cost less than ten bucks a year and I want to be able to edit every single line of code that contributes to my webpage.
I decided to opt for a compromis: a static website generator (Hugo, in my case) that converts markdown files to html for me. Any metadata about posts (author,date,tags etc.) can also be defined in a markdown file by adding a header written in the YAML language. The transition to the new format was confusing because I again simply dove in without doing research. All I needed to know to begin was that Hugo played nice with netlify.com, where this website is currently hosted. An added advantage was that it forced me to reorganize the website. In order for the hugo server to find all required files everything needed to follow a well-defined folder structure. The main issue was figuring out how to keep my original homepage, while simultaneously setting up hugo in such a way that I could easily add new content with more rich features. Long story short: I ended up delaying university work for a day, shrunk down my original homepage to the bare minimum (a first step to cleaning up wandering css bits), and added this blog! Not too shabby. 

**Content**\
As far as the content of this blog section of my site goes: I intend to use it as a mnemonic device. Over the years I have occupied myself with studying such diverse topics, only to realize that I can barely recollect half of it. So as a rule of thumb for this blog: if I spend a considerable amount of time on one topic, I should record it in this elaborate and weirdly public note-taking system. My best guess at the moment is that those notes are likely to be related either to philosophy, artificial intelligence, or the ongoing discovery of (Arch) Linux and the design of a nice workflow.  What emerges over time is hopefully a rhizomatic collection of interesting notes, where no one (including me) really has a central oversight on the contents, where there is no category table assigning everything its proper place, but where posts branch out and interlink chaos-logically. This is reflected in the only "searchable" feature of this blog: clicking on the tag of a blogpost shows you posts with the same tag.

**Summary of current workflow**:\
1) Markdown + vim\
2) Pushing to the website's git repository\
3) Automatic deployment on netlify. Netlify takes the "public" directory in which the hugo server publishes the site locally, and builds it with the hugo command. 

In other words, I can simply write all my content in markdown, and I never have to leave my terminal for maintaining my website.


```
EOF
```

