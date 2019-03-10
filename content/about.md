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

This is the website of Edwin Wenink, a student of philosophy and artificial intelligence. 
I wrote this static website (<a href="https://github.com/EdwinWenink/personal_website">source</a>) not because I'm into writing websites, but because I like to do things myself for the learning experience.
I live in Nijmegen, the Netherlands. Click [here]({{<baseurl>}}etc/cv) for a very brief C.V.

I intend to use my blog as a mnemonic device.
Over the years I have occupied myself with studying such [diverse topics]({{<baseurl>}}etc/courses), only to realize that I can barely recollect half of it.
So as a rule of thumb for this blog: if I spend a considerable amount of time on one topic, I should record some of it in this unorthodox note-taking system.
That's why I called my writing "engrams": they are memory traces on the web.
My best guess at the moment is that those memory traces are likely to be related either to philosophy, artificial intelligence, or the ongoing discovery of (Arch) Linux and the design of a nice workflow.
What emerges over time will be a rhizomatic collection of hopefully interesting notes, where no one (including me) really has a central oversight on the contents, where there is no category table assigning everything its proper place, but where posts branch out and interlink chaos-logically. This is reflected in the only "searchable” feature of this blog: clicking on the tag of a blog post shows you posts with the same tag.
I encourage you to do this and trace your own path.

Feel free to send me a mail in response to anything on this website.
If you want to encrypt it, <a href="https://www.edwinwenink.xyz/page/pgp.html"> here </a> is my PGP key.

<figure>
   <img align="center" style="width:100%" src="/images/boypoolrhizome.jpg" />
   <figcaption> <a href="https://markingham.org/stories/becoming-rhizomatic/boypoolrhizome-2/"> BoyPoolRhizome by Mark Ingham</a>
</figure>
<br>


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

