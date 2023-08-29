---
title: "My Vinyl Record Collection"
date: 2023-08-29T12:03:02+02:00
draft: false
author: "Edwin Wenink"
tags: ['website', 'programming', 'python', 'music']
series: ['website']
---

I added a digital [vinyl record display](/records/) to this website, have a look!

The idea was to digitally reproduce one of those fancy wall mounts for displaying records in your room.
You can click on each record to see some basic information.

All vinyl records I physically own are registered on [Discogs](https://www.discogs.com/).
I used the Discogs API to automatically retrieve my collection, parse the information I want, and store all results in Markdown files that can be consumed on this website.

If you like what you see, I [open sourced my code](https://github.com/EdwinWenink/discogs_vinyl_record_display) to reproduce these results so you can make your own digital wall too.
The project's README explains how to run the project using your own Discogs collection.
The only thing you need is a Discogs user name, Python, and optionally an authentication token to get links to cover images.
Also note that Discogs throttles requests per minute, so check out my tip on deployment too.

If you like this project, give it a star on Github and share a link to your digital record collection.
I'd love to see it!
