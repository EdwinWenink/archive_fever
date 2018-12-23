---
title: "About"
date: 2018-04-04T03:21:00+08:00
type: about
---

<meta charset="UTF-8">
<head>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src ="/scripts/lastfm_query.js"> </script>
</head>

This is the blog of Edwin Wenink, a student of philosophy and artificial intelligence. 

I intend to use this blog as a mnemonic device.
Over the years I have occupied myself with studying such [diverse topics](https://edwinwenink.xyz/page/courses.html), only to realize that I can barely recollect half of it.
So as a rule of thumb for this blog: if I spend a considerable amount of time on one topic, I should record it in this elaborate and weirdly public note-taking system.
My best guess at the moment is that those notes are likely to be related     either to philosophy, artificial intelligence, or the ongoing discovery of (Arch) Linux and the design of a nice workflow.
What emerges over time is hopefully a rhizomatic collection of interesting notes, where no one (including me) really has a central oversight on the contents, where there is no category table assigning everything its proper place, but where posts branch out and interlink chaos-logically. This is reflected in the only "searchable” feature of this blog: clicking on the tag of a blogpost shows you posts with the same tag.

Feel free to send me a mail in response to anything on this website.
If you want to encrypt it, <a href="https://www.edwinwenink.xyz/page/pgp.html"> here </a> is my PGP key.

<html>
	<h1> Musical statistics </h1>
	<div>
		<p> 
		When I meet new people I often ask them about their music taste.
		When people return the favor and ask me what I listen to, I often spin my music taste in a particular direction depending on the context of the conversation. But what is more honest than just listing what I *actually* listen to?
		These musical statistics are generated automatically
		through interacting with the LastFM API. 
		See the scripts I wrote for this <a href="https://github.com/EdwinWenink/personal_website/tree/master/static/scripts">here</a>.
		</p>
		<p id="now_playing"></p>
	</div>
	<div>
		<p> Last week, I listened to these five artists the most: </p>
		<table id="weekly_artists" border="1">
			<thead> 
				<th> Artist </th>
				<th> Playcount </th>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	<div>
		<p> And this is the overall leaderboard: </p>
		<table id="artists" border="1">
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

