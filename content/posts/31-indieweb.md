---
author: "Edwin Wenink"
title: "This domain joined the IndieWeb!"
date: 2019-05-19
draft: false
tags: [IndieWeb, brid.gy, webmention.io, IndieAuth, microformats2]
---

I joined the IndieWeb!

What does that mean?
For the long version, I recommend reading [An Introduction to the IndieWeb](https://boffosocko.com/2017/07/28/an-introduction-to-the-indieweb/).
Here is a super short version:

1) This web domain now is my main online identity, and I can use my domain as a way of authentication with
a) "rel=me" links 
b) and my domain name via [IndieAuth](https://indieauth.com/)

Examples:

1a: I was invited to the Mastodon instance of [@arjen](https://idf.social/@arjen) and verified my identity as "Edwin Wenink" by linking from Mastodon to my domain, and then from my domain to Mastodon as such: \< a rel="me" href="https://idf.social/@edwin">Mastodon</ a>.
IndieWeb applications look at these "rel=me" links as an identity claim, and can confirm that these two domains point to each other.
As a result, you can see my domain with a green check mark [on my profile](https://idf.social/@edwin).

1b. I logged in with my domain name on [webmention.io](https://webmention.io) using IndieAuth. Because my domain and GitHub were linked through "rel=me" links, I could authenticate using GitHub, while using my domain name instead of GitHub credentials.

2) My content now follows the [microformats2](http://microformats.org/wiki/microformats-2) format, which allows other members of the IndieWeb and related applications to find and parse my content and my online identity in a unified manner. 

3) I can [POSSE](https://indieweb.org/POSSE) content to other sites if I want to, and feed responses back into my own website using [webmention.io](https://webmention.io). 
POSSE simply means that you publish everything on your own website, and "syndicate" a linked copy to other places.
This can be done in such a way that the responses to your copied post on that other website are fed back into your own website again through ["webmentions"](https://indieweb.org/Webmention).
This thus facilitates all kinds of interaction with social platforms or other blogs without leaving my own website. 
Most importantly, contra usual social networks, all data of this interaction is controlled through my own domain, collected in one place, belonging to and shaping a sensible online identity.

In principle this interaction requires that other services also follow IndieWeb standards, but luckily there are services such as [bridgy](https://brid.gy/) that are able to translate e.g. tweets into "webmentions" following the microformats2 format. 
You can either handle these webmentions yourself in order to display them on your website, or let another service handle the webmentions. 
I do the latter since I have a static website.

So for example, let's assume there exists a possible world in which I would tweet. 
Then I could post tweets from my own website by POSSEing the tweets, feeding back the responses to webmentions.io with bridgy, *and maintain all my tweets including responses, even if Twitter goes bankrupt or becomes super evil*. 
I could for example also post comments on GitHub pull requests on my own website, and then syndicate them to the appropriate place on GitHub. 
There is even a [bridgy for federated networks](https://fed.brid.gy/). 

To setup everything, I simply followed the steps of [indiewebify.me](https://indiewebify.me/), the sole purpose of which is to help you make the transition easily.
Most of it is relatively straightforward if you read up on the underlying principles, but I have to admit I got lost in the [IndieWeb wiki](https://indieweb.org/) at least four times before getting the point and finding the right links.
So I hope this post provides some pointers if you are interested.

To interact with the [webmention.io](https://webmention.io) API in order to show webmentions under this post, I used [this JavaScript gist](https://gist.github.com/am1t/7295b4eaf101372ea71c877cfd8be694).
What's also very nice is that I can subscribe to an RSS feed of webmentions coming in, so I keep up to date about responses to my website in real-time.

There's still much to learn for me, but my website now fulfills the minimum requirements to be part of the IndieWeb.
But a more interesting question is perhaps:
What does this mean all mean for you?

It means that you can now, in addition to my not-so-regular "regular" comment system, react here to my posts *through your own service*. 
As long as your reaction follows microformats2, it can be displayed directly under this post.
In contrast to my normal comments, which I store on my own domain, the reply will thus *live on your own social network/site/domain*. 
I could of course decide to maintain a repository of copies of responses, but nevertheless you maintain your authority over your data on your own domain.
What you see now under my post is merely a link pointing to your response, without any reference to a central repository. 
In this way a decentralized interaction between individual personal websites takes shape, which can be the basis of a network of federated conversations.

Isn't that how the web was supposed to be? Really a *web*.

If you make your website IndieWeb compatible, let me know below through a "webmention".
You can submit your reaction to be displayed by filling in the URL of your reaction (again: look at microformats2).
You can see an example reaction [here](https://www.edwinwenink.xyz/page/webmention.html), which is linked below in the brand new "Webmentions" section.
To conclude, I added some useful links on my [blogroll](https://www.edwinwenink.xyz/etc/blogroll).

