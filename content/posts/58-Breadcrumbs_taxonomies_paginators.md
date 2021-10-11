---
title: "Site update: Breadcrumbs, taxonomies, paginators"
date: 2021-10-11T23:34:31+02:00
draft: false
author: "Edwin Wenink"
tags: ['hugo', 'templating', 'programming', 'website']
series: ['Website']
toc: true
---

I have just added some new features to this website.

## Breadcrumb navigation

This took a bit of puzzling. 
To get all the breadcrumbs, you essentially want to parse all the URL components of the current URL relate to the base domain.
The Hugo `split` function returns an empty head and tail, which I needed to filter out.

I wanted to keep my regular navigation bar next to the breadcrumb navigation.
This means that if I visit let's say the "about" page, that *both* the breadcrumb and regular navigation bar show the "about" page.
As a nice twist, I therefore remove a reference from the regular menu if it is already mentioned in the breadcrumb navigation (i.e. if it's the current page).

```
<div id="breadcrumbs">
    <!-- Remove empty first and last element -->
    {{ $url  := .RelPermalink }}
    {{ $components := last 2 (split (delimit (split .RelPermalink "/") "," "") "," ) }}
    {{ $counter := 0 }}

    <!-- The breadcrumbs -->
    {{ range $components }}
        {{ $counter = add $counter 1 }}
        <!-- Following line is strictly not necessary anymore
            because I filter out the empty elements above -->
        {{ if gt (len . ) 0 }}
            {{ if eq $counter (len $components) }}
                > <a href="{{ $url }}">{{ humanize . }}</a>
            {{ else }}
                > <a href="/{{ . }}">{{ humanize . }}</a>
            {{ end }}
        {{ end }}
    {{ end }}
    | 
	<!-- Navigation Pages -->
    {{ range .Site.Menus.main }}
        {{ if ne $url .URL }}
            <a href="{{ .URL }}">{{ .Name }}</a>&nbsp;&nbsp;
        {{ end }}
    {{ end }}
</div>
```

## {{ define "main" }} and baseof.html

I started this website without understanding much about ... anything really.
By now I have a better grip of the Hugo language.
In all my templates I initially separately defined a header and footer partial, which amounts to a lot of unnecessary repetition.
Hugo avoids this bad pattern by allowing you to define a `baseof.html` template, as such:

```
<!DOCTYPE html>
<html lang="en">
    {{ partial "header.html" . }}
    <body>
        <div id="content">
        {{- block "main" . }}{{- end -}}
        </div>
        {{ partial "footer.html" . }}
    </body>
</html>
```

Now we no longer have to repeat the header and footer templates.
Instead, other templates are responsible for filling in the main block with `{{ define "main" }} ... {{ end }}`.
The next section shows a full example.

## Section index pages

Having proper index pages for sections is not hard to do at all and yet, I never had them.
This is because I did not fully understand how Hugo treats `_index.md` pages in the content organization. 
But once I did understand, I still didn't get them to work.
Turns out I had `disableKinds` enabled for sections in my `config.toml`.
I can't remember at all that I enabled this and it took way too long to figure out this prevented Hugo from generating index pages.

```
{{ define "main" }}

{{ partial "paginator.html" . }}

<div>
    {{ .Content }}
    <ul>
    {{ range .Paginator.Pages }}
    <h1><a href="{{ .Page.Permalink }}">{{ .Page.Title }}</a></h1>
        {{ .Content }}
    {{ end }}
    </ul>
</div>

{{ partial "paginator.html" . }}

{{ end }}
```

In addition to the [archive](/archives), which has a template of its own, the [posts](/posts/) now have their own page where you can scroll through all the posts.

## Paginator

As you can also see in the above snippet, I also introduced a paginator in the section index pages.
You can use the default Hugo paginator with `{{ template "_internal/pagination.html" . }}`, but I built a simple custom paginator instead:

```
{{ $paginator := .Paginator }}
{{ if gt $paginator.TotalPages 1 }}
    <div style="text-align: center; font-size: 1.5em; margin: 1em;">
        <!--{{ template "_internal/pagination.html" . }}-->

        <!-- First page. -->
          <a  href="{{ $paginator.First.URL }}"> 0 </a>
        </li>

      <!-- Previous page. -->
        {{ if $paginator.HasPrev }}
          <a href="{{ $paginator.Prev.URL }}"><--</a>
        {{ end }}

        {{ range after 1 $paginator.Pagers }}
            {{ if eq . $paginator }}
                [ {{ .PageNumber }} ]
            {{ end  }}
        {{ end }}

       <!-- Next page. -->
        {{ if $paginator.HasNext }}
        <a href="{{ $paginator.Next.URL }}">--></a>
        {{ end }}

        <!-- Last page. -->
          <a  href="{{ $paginator.Last.URL }}"> N </a>
        </li>
    </div>
{{ end  }}
```

The paginator doesn't show if there is only one page.
The "next" arrow also does not show when there's no next page.
Be aware that I used inline styles, because I'm bothered by my browsers/Hugo not picking up css changes in the static style.css file in time.

## Series taxonomy

In the [AI Ethics Tool Landscape](/posts/57-ai_ethics_tool_landscape/) I heavily made use of taxonomies, which made me realize I should also do this on my personal website.
I added a new [series](/series/) taxonomy.
I also wrote a `terms.html` template that does not only lists the taxonomy terms, but also counts how often they occur:

```
{{ define "main" }}

<div>
   <h1>{{ .Title }}</h1>
    {{ .Content }}
    {{ range sort .Data.Terms }}
        <li><a href="{{ .Page.Permalink }}">{{ upper .Page.Title }}</a> ({{ .Count }})</li>
    {{ end }}
</div>

{{ end }}
```

## Date of last modification

This is a really cool Hugo feature I wasn't aware of before.
If you keep your Hugo site in a git repo (which you should anyways), the Hugo build can pick up the latest commit made on the current file in order to show the date of the last edit.
It's as simple as:

```
<aside> 
  Last modified on {{ .Lastmod.Format "2 January, 2006"}}.
</aside>
```
