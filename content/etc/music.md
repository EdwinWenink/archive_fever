---
title: "Music statistics"
date: 2018-04-04T03:21:00+08:00
author: Edwin Wenink
tags: ['etc']
---

<meta charset="UTF-8">
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="/scripts/lastfm_query.js"></script>
</head>

When I meet new people I often ask them about their music taste.
When people return the favor and ask me what I listen to, I often spin my music taste in a particular direction depending on the context of the conversation. But what is more honest than just listing what I *actually* listen to?
These musical statistics are generated automatically
through interacting with the LastFM API. 
See the scripts I wrote for this <a href="https://github.com/EdwinWenink/personal_website/tree/master/static/scripts">here</a>.

<div style="display: flex; align-items: center;">
    <div><p id="now_playing" style="flex: 50%; padding: 2em;"></p></div>
    <div><p id="now_playing_img" style="flex: 50%;"></p></div>
</div>

Last week, I listened to these five artists the most:

<div>
<table id="weekly_artists" border="1" style="width: 100%">
<thead> 
<th> Artist </th>
<th> Playcount </th>
</thead>
<tbody>
</tbody>
</table>
</div>

And this is the overall leaderboard:

<div>
<table id="artists" border="1" style="width: 100%">
<thead> 
<th> Artist </th>
<th> Playcount </th>
</thead>
<tbody>
</tbody>
</table>
</div>
<div>
<p id="tags"></p>
</div>
</html>

