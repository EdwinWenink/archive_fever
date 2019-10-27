---
title: "Hugo template snippets of new website features"
author: Edwin Wenink
date: 2019-10-21
tags: [hugo, templating, programming, website]
toc: true
---

I have made progress in my understanding of Go templating, and in particular its scope limitations (see for example [this](https://regisphilibert.com/blog/2018/02/hugo-the-scope-the-context-and-the-dot/)).
This allowed me to implement some new features that I was struggling with before. 
In this post I give an overview of new features, together with their implementation in Hugo.
Most new features are small tweaks that extend on existing functionality.
However, [since I joined the IndieWeb](https://www.edwinwenink.xyz/posts/31-indieweb/), I also added a completely new aspect to this website, namely so-called "microposts". 
Twittering is not my style, but I did crave for a place to share interesting bookmarks and other blogs in a more dynamic fashion than your classic blogroll (which I [also have](https://www.edwinwenink.xyz/etc/blogroll/) by the way).
I had to write some code to support [microformats2](http://microformats.org/wiki/microformats-2), which is what my microposts use.

Below I summarize the new features and provide related code snippets. 
Perhaps they are of use to you!

### Preview of first two tags above each post

On the homepage I display the most recent blog posts (I call them "engrams"). 
For each post I wanted to add a preview of its tags.
I limited the preview to two tags only, because otherwise the tags overflow on mobile phones.
If the post has more tags then two, dots will be displayed.

You can navigate the site by clicking on the tags, try it out!
Clicking on a tag will reload the same page, but you will see that the previewed blog posts all correspond to the chosen tag.

The following assumes you are looping over your posts:

```html
<aside>{{ .Date.Format "January 2, 2006"}} 
  {{ if not (eq .Params.tags nil) }}
	{{ range first 2 $value.Params.tags }}
      <a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}/"
      style="text-decoration:none">#{{ lower . }}</a>
	{{ end }}
	{{ if gt (len .Params.tags) 2 }}
		...
  {{ end }}
{{ end }}
</aside>
```

### Show a preview of the latest post

Hugo offers a handy summary option that automatically generates an "abstract".
If the summary is too long, you can manually truncate it to a particular amount of characters.

```html
<div class="preview">
{{ range $index, $value := first 6 (where .Pages ".Type" "posts") }}
  <p>
	<a href="{{ .Permalink }}">{{ .Title }}</a>
	{{ if .Params.guest }} (by {{ .Params.author }}) {{ end }}
	{{ if .Draft }} <span style="color:#FF4136;">(unpublished)</span> {{ end }}
  </p>
  {{ if (eq $index 0) }}
	<blockquote>{{ truncate 350 .Summary }}
	<p><a href="{{ .RelPermalink }}">Read more</a><p>
	</blockquote>
  {{ end }}
{{ end }}
<br>
<p> See <a href="{{ .Site.BaseURL }}/archives"> archives</a> for more ... </p>
</div>
```

### Deduplicated tags in Tag Roulette

On my homepage I have an overview of the tags of all posts, so that one can pick a tag of interest and browse through corresponding posts.
Previously I looped over all my posts, and then immediately rendered their tags.
The result of this naive approach is that the tag overview will have many duplicate tags.
In a normal programming language this is a trivial issue: you would keep track of a list of tags and make sure to not add duplicate tags (or perhaps work with a set), before rendering anything.
However, Go templating has its own unique way of defining the scope of variables. 
For example, when you range over tags, the broadest scope you can access from within that loop (`{{ . }}`) is that tag. 

This means it is not straightforward to work with variables outside of that scope.
That is... until I found out about Hugo's scratchpad, which allows you to define custom variables on the scope of the whole page.
You can add data of interest under a particular key that you define yourself.
One detail I had to get right in order to make this work, is to ensure that tags are added to a list, rather than replacing the previous value. 
So rather than using the `.Scratch.Set` method, I used the `.Add` method.
The `.Add` method assumes we are working with a list though, whereas our tags are strings. 
So before adding tags, I convert it to a list with the `slice` function.

```html
<div class="tags">
<h2 id="tags"> Tag roulette </h2>
<br>
{{$tags := newScratch }}
{{ range .Site.Pages }} 
  {{ if eq .Type "posts"}}
	{{ range .Params.tags }}
		{{ $name := lower .  }}
		{{ $array := $tags.Get "tags" }}
		{{ if not (in $array $name)}}
	      {{ $tags.Add "tags" (slice $name)}}
		  <a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}/">{{ lower $name }}</a>
        {{ end }}
    {{end}}
  {{ end }}
{{ end }}
</div>
``` 

The only thing that still bothers me is that I did not figure out how to do `{{ $array := $tags.Get "tags" }}` inline.

### Preview of latest micros

The most important element here is to distinguish pages of the type "micro" from regular posts. 
The layout "content_only" calls a partial that I wrote for displaying html using microformats2 (see next section).

```html
<div>
<h2 > Micros </h2>
{{ range first 3 (where .Site.RegularPages ".Type" "micro") }}
  <div class="hover-box">
	<p>{{ .Render "content_only" }}</p>
  </div>
{{ end }}
<p> See <a href="{{ .Site.BaseURL }}/microblog"> microblog</a> for more ... </p>
<br>
</div>
```

### Microformats2

I wanted to display different type of micros in different manners.
For example, I wanted bookmarks to show a book symbol with the URL of the bookmark. 
For events I want to show a calender, and for music events (a subcategory) I want to show a music notes instead.
For replies, I want to provide the URL of the post I am replying to. 
For likes, I want to show a heart.

This is work in progress, but for now I wrote the following partial:

```html
<body>
{{ if not .Params.event }}
  <div class="h-entry">
	<div class="u-author h-card" style="display:none">
      <a href="{{ .Site.BaseURL }}" class="u-url p-name">Edwin Wenink</a>
	</div>
	<div class="micro">
	  <a href="{{ .Permalink }}">
		<h4>{{ .Title}}</h4>
		<aside>{{ .Date.Format "January 2, 2006"}}</aside></a>

		{{ if .Params.reply }}
  		  <p>In reply to &#8594 <a class="u-in-reply-to" href="{{ .Params.target}}">{{ .Params.target }}</a></p>
		{{ end }}

		{{ if .Params.like }}
		  <p>Edwin &#10084 <a class="u-like-of" href="{{ .Params.target }}"> {{ .Params.target }}</a></p>
		{{ end }}

		{{ if .Params.bookmark }}
		  <p>&#128214 <a class="u-url u-uid" href="{{ .Params.target }}">{{ .Params.target }}</a></p>
		{{ end }}
{{ else }}
  <div class="h-event">
	<div class="micro">
	  <h4 class="p-name"> 
		<a class="u-url" href={{ .Params.target }}>
		{{ if eq .Params.category "music" }}
 		  &#9836
		{{ else }}
		  &#128198
		{{ end }}
		{{ .Title }}</a>
	  </h4>
	  <a href="{{ .Permalink }}">
	    <aside><time class="dt-start">{{ .Date.Format "January 2, 2006 15:04" }}</time></aside>
	  </a>
{{ end }}
  <p class="e-content">
	{{ if .Content }}
	  &#8620 {{ .Content | markdownify }}
	{{ end }}
   </p>
   </div>
 </div>
</body>
```

### Links to latest, previous and next post

Hugo makes this feature extremely easy by providing default functions.
The `with` function is particularly handy, because it knows how to deal with `nils`. 
This ensures that when the are at the latest post, we will not cause any errors by trying to find the next post, which does not exist.

```html
<div>
{{$posts := ($.Site.GetPage "section" "posts").Pages.ByPublishDate.Reverse}}
<!--Grab the most recent-->
{{ range first 1 $posts }}
  <p><b>Latest</b>: <a href="{{ .Permalink }}">{{ .Title }}</a></p>
{{ end }}

{{ with .NextInSection }}
  <p><b>Next:</b> <a href="{{ .Permalink }}">{{ .Title }}</a></p>
{{ end }}

{{ with .PrevInSection }}
  <p><b>Previous:</b> <a href="{{ .Permalink }}">{{ .Title }}</a></p>
{{ end }}
</div>
```

What would be a cool improvement for the future is also linking to a relevant post with a similar tag.

### Show latest comments (WIP)

The most recent feature (I started on it today) is a preview of the latest comments on my website.
The challenge for this feature was that comments are stored in a separate data folder in a nested manner, where each post has its own comment directory.
Sorting all comments on their date *per post* is trivial, but it is harder to find the latest comment overall, so from *all posts*. 
Again, I could not solve this problem before I figured out how to use Hugo's scratchpad.
A nice feature I added is that clicking on each preview brings you to the exact location of the comment.
I also distinguish between comments on the original post, and replies on comments of other people.

```html
<div>
{{ $all_comments := newScratch }}
{{ range $commented_posts := $.Site.Data.comments }}
  {{ range . }}
	{{ $all_comments.Add "comments" (slice . ) }}
  {{ end}}
{{ end }}
<h2> Latest comments </h2>
<br>
<aside>Last 4 of {{ len ($all_comments.Get "comments") }} comments in total:</aside>
<p>
{{ range first 4 (sort ($all_comments.Get "comments") ".date" "desc") }}
  {{ if .reply_to}}
	{{ .name }} replied to <a href="{{ "posts/" | absLangURL }}{{ ._parent | urlize }}#{{._id}}">{{._parent}}</a>  on {{ dateFormat "Monday, Jan 2, 2006" .date }}<br>
  {{ else}}
	{{ .name }} commented on <a href="{{ "posts/" | absLangURL }}{{ ._parent | urlize }}#{{._id}}">{{._parent}}</a>  on {{ dateFormat "Monday, Jan 2, 2006" .date }}<br>
  {{ end}}
{{ end }}
</p>
</div>
```

There are still things to do though. 
I want to display the name of the post in a more pretty manner, rather than showing its url. 
In case of replies, it would also be nice to retrieve the name of the person replied to, but this has low priority and is rather complex due to the way my comment system is set up (see [this post](https://www.edwinwenink.xyz/posts/18-comments/)).


