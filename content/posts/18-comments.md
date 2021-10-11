---
author: "Edwin Wenink"
title: "New feature! Added comments to this *static* website"
date: 2018-12-28
draft: false
tags: [staticman, raspberry pi, github, netlify, comments, website]
series: ['Website']
---

A friend challenged me to implement the option to leave comments on blog posts over the Christmas break, and rightfully so. 
I write these posts about things that currently interest me, not because I think I know it all, but to record a thought process or idea for later review by me or others. 
A blog is not the place for publishing well-polished papers, but instead ideally is a playground for developing and testing ideas in interaction with others.
It is a big mistake when writing anything really, to not ask for feedback. 
That's why I always share whatever I write with my friends, to see if something resonates. 
The conversations that this sometimes sparks up have been private so far, but I would like to at least give everyone (including all spambots out there) the opportunity to weigh in.

But there's a challenge: my website is completely static, meaning that there is no backend server with which a user can interact to leave a comment on my blog. 
I wasn't willing to give up the advantages of a static website just yet: it's super fast, it's secure, and I host it completely for free. There are some solutions for nevertheless still allowing users to leave a comment, but they all require the comments to be stored externally (e.g. on reddit), or involve some third-party widget to interact with an external database. So either the content is not visible directly on my website, or I have some ugly widget on my website messing with the slick look that I'm finally pretty happy with. 
But worst of all, in both those scenarios I do not have any control over the storing of the comments, as they are not part of my website! 

But then I found a really cool option. This nice guy wrote a bot called <a href="https://github.com/eduardoboucas/staticman">staticman</a>. The bot takes input from the form under this blog post, creates an appropriate .yml file for the comment, connects to its very own GitHub account, and then makes a merge request for adding the comment to the appropriate blog post. It is also possible to automatically push to my live master branch, but I preferred to have an extra check to guard against spam.
This is awesome for static websites with auto-deployment, such as mine, which is hosted on Netlify. It literally solves all problems I had with other options: I have no external widgets on my website, yet all comments are visible on the same webpage as the blog. 
Most importantly, all comments are stored together with my website, and they are under my version control.

The writer of staticman created a public staticman GitHub account, but I found that it was horribly overloaded and being blocked by GitHub restrictions on the maximum amount of merge requests that are allowed per hour, as many people started using it. But the idea of staticman was too cool to give up immediately, so I decided to set up a raspberry pi that I borrowed from a friend with the GitHub bot. 
It took me a few days to set everything up, there was plenty to do and I made enough mistakes on the way. On my website I needed to write Hugo code for sending comment information to the bot, and for showing existing comments under the right blog posts. I also added a captcha to limit spam. It took me a while to find out how to send blog posts to the right folders and render them on the right web pages. It was useful to look at this <a href="https://github.com/eduardoboucas/hugo-plus-staticman">example website</a>. But most importantly, to allow people to reply on comments of others, <a href="https://networkhobo.com/2017/12/30/hugo-staticman-nested-replies-and-e-mail-notifications/">this blog</a> was incredibly helpful. Other things you have to do for this setup is creating appropriate configuration files with options and instructions for the GitHub bot, and of course setting up the actual GitHub bot itself, by creating an account and generating a key on GitHub so that the bot can access the account. You also need to give it access to a branch of the repo that your website is stored on.
Then there's setting up the staticman bot on the raspberry pi. I tried using docker since node.js didn't work for me out of the box. But getting docker to work on the ARM architecture of the raspberry pi was much more of a pain than fixing the errors I had with the `npm` command. Then... some port magic, some bug fixing for bugs that I created myself, testing, and voila!

This is the flow: 

1) You fill in the form, and send the data to the Github bot running on the raspberry pi at my home.

2) The GitHub bot logs in to GitHub, creates a branch, and makes a merge request to apply a `commentid.yml` file and put it in the right folder in the repo of my website.

3) I allow the merge request (optional: can also be automatic).

4) GitHub hooks into Netlify, and the website is automatically updated and deployed after the merge request.

We'll see how it goes! Feel free to respond, leave ideas, suggestions etc. 
Be aware that your comment will not automatically show since I need to approve them first. 
I might change that if it turns out the spam is not too bad.
A thing I'll consider adding later is the option to receive emails when people reply on your comment, but for now I'll test the current setup first. 
We'll see how the raspberry pi holds up. It will be a bit slow, and the connection is not secured. If it's broken please let me know over email!
