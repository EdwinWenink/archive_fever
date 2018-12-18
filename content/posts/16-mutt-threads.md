---
author: "Edwin Wenink"
title: "Sorting threads in NeoMutt"
date: 2018-12-18
draft: false
tags: [Neomutt, Email, Rice]
---

In NeoMutt, which I use for email, I wanted view email conversations (a "thread") as a tree-like representation. 
This option can be enabled by sorting on threads. 
However, by default threads are sorted by their oldest message, which is the original email to which others started responding. 
This causes the unwanted behavior that new emails that belong to a thread to not show on top of my inbox, but instead are hidden somewhere deeper in my inbox, sorted at the date of the older original post.
I did not quickly find people with similar wishes (and solution) on the internet, so I considered it potentially helpful to write down my solution here.

To solve this behavior, I defined a secondary sorting method. 
The primary sorting method is on threads, but I want threads themselves to be sorted based on the date of the newest message. 
Also, I still want to ensure that newest messages show up on top, and not on the bottom (this is the reverse of the default setting in NeoMutt).
I achieved this by setting these variables in my `neomuttrc`:

```Bash
set sort = threads 
set sort_aux = reverse-last-date-received
```

This produces a tree-like representation as such:

<figure>
   <img align="center" style="width:100%" src="/images/16-blog/mutt_thread.png" />
   <figcaption> Example of a sorted thread in NeoMutt
</figure>
<br>

Note that this is a very messy thread, where nobody cared to change the email title, and where multiple threads branch off from each other.
Nevertheless, using NeoMutt with the thread sorting, I know exactly who responded to who.

