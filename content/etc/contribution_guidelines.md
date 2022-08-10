---
title: Contribution Guidelines
toc: true
author: Edwin Wenink
tags: ['etc']
---

Here are some guidelines if you are interested in making a guest contribution to this website. 

The basic deal is: you contribute, I edit and provide feedback, and you get your own personal page on this domain where all your contributions are listed.
Copyright etc. remains with the author and it's perfectly fine if posts are also published somewhere else.

## What can be the purpose of a post?

- Try to explain an idea or concept in plain language
- Show an interesting use case for an idea
- Tutorial on how to solve a practical problem
- Critically reflect on a book or cultural phenomenon
- Spark an *informed* discussion
	* N.B. this website is primarily written from an "intellectual" perspective rather than a political one.
	* N.B. N.B. that does not exclude political topics necessarily, but requires a critical rather than an ideological perspective.

## Reasons to contribute a post

- Egoistic reasons: promote your ideas, build a portfolio, reach more people
	* Getting your work published on someone else's site means that at least one person thought it was worthwhile. 
* More idealistic: if you have spent time anyway on solving some problem or working out some idea, it could be interesting and useful for others.
	* Chances are that you regularly use insightful writings of others on the internet. Give something back!
- Pragmatic: Seek interaction and feedback on ideas in development
- You like my site and the ideas behind it

Writing a blog post does not have to be a huge time investment. 
If you think you do not have time to write a blog, I strongly urge you to read Matt Might's [6 blog tips for busy academics](http://matt.might.net/articles/how-to-blog-as-an-academic/). 
The main point is "to make blogging a natural byproduct of all the things that academics already do."

## What do you write about?

You can have a look through the archives to get a feel for the overall style and topics of this site.
I have a broad interest in all things "intellectual", ranging from various fields of philosophy, science, technology, their intersections or their societal relevance, to literature and to programming.
I do not write a lot about art and culture on this website myself, so this is a void that could very well be filled by another author.
What I'm trying to say is that you should not restrict yourself to the topics already discussed on the website.
Pursue your own interests.
If I'm interested in your idea, others are probably too.
You can always send me a message before starting writing to get a feeling if we are a match. 

I'm looking forwards to learn from you.

## General tips

- Try to not assume too much knowledge from your reader, as you are not writing for specialists
- Try to focus on a single concept or clear theme
- State as soon as possible what the post is about, i.e. its goal or main concept
- Think about whether your title indicates what the post is about
- Do not end a good post with an anticlimax

## Recommended size 

This site does not enforce a particular format due to its broad scope. 
Diversity both in topics and writing is welcomed.
A difference in post length should correspond to a particular purpose.
Depending on the type of post you plan on writing, here are some sensible defaults.

### Default (+/- 1000 words)

By default a maximum of 1000 words is appropriate for a blog post. 
This guideline helps you focus on your main point and is particularly appropriate for posts that explain a single idea, be it technical or philosophical. 
Many people read blogs from their phone and they will likely be distracted when reading longer posts.

Examples: 

- [Paradoxes of the logical implication](https://www.edwinwenink.xyz/posts/26-paradoxes_of_implication/)
- [Pick a random background on each boot (Linux)](https://www.edwinwenink.xyz/posts/40-arch_background/)
- [How many 2-ary boolean functions can a perceptron model](https://www.edwinwenink.xyz/posts/39-perceptron_boolean_functions/)
- [Writing a letter the cool way... for free](https://www.edwinwenink.xyz/posts/10-writing_letters_cool_and_free/)
- [Ethics of Autonomous Vehicles: Beyond the Trolley Dilemma](https://www.edwinwenink.xyz/posts/25-ethics_autonomous_driving/)
- [Warlike Acts in the Cyber Domain](https://www.edwinwenink.xyz/posts/24-war_terrorism_cyberdomain/)

### Short (max. 500 words)

Of course, posts can be shorter. 
If the goal of your post is not to explain a topic but to spark discussion, a maximum of 500 words could suffice.
For example, you may have come across something and want to highlight notable points that may have relevance for others. For example, my shortest post is probably [Two notes on the original Google paper](https://www.edwinwenink.xyz/posts/22-note_on_google_paper/), which is written after a guest lecture at university and simply provides two pointers for further discussion that are somewhat ironic given the current cultural and societal dominance of Google.

### Long reads (2000-3000 words)

Longer posts are also welcomed, but ask yourself *why* the post is longer and whether it *needs* to be longer.
The length of a post should be justified by its topic (for example its complexity) and not by inefficient writing.

So far I find that the longer posts I wrote are long because they ...

- ... have a more academic style and structure, i.e. that of a paper/article or academic book review
	* Require table of content
	* Require references
	* Headers and subheaders
	* More classical structure, e.g. introduction, body, conclusion

Examples:

- [Deepfakes and democracy: a case for technological mediation ](https://www.edwinwenink.xyz/posts/37-deepfakes/)
- [Book review: Van der Heiden - The Truth (and Untruth) of Language ](https://www.edwinwenink.xyz/posts/36-review_vanderheiden2010/)
- [Friendship, death, and writing in Michel de Montaigne's Essays ](https://www.edwinwenink.xyz/posts/34-friendship_montaigne/)


[-](-.md) ... explain not a single idea but a project
	* larger size results from explaining and contextualizing various separate steps
	* as well as from providing code blocks

Examples:

- [Building a Note-taking System with Vanilla Vim](https://www.edwinwenink.xyz/posts/42-vim_notetaking/)
- [Custom Note Tagging System with Ctags and Vim](https://www.edwinwenink.xyz/posts/43-notes_tagging/)

### Other

When you find you need more than let's say 4000 words, your idea is probably too big for a blog post. 
That's not necessarily an issue: try to split up your idea into several smaller ideas. 
You could write a post on each separate part and develop a small series of posts. 
Of course, when you encounter this situation there is a good chance it is caused by lack of focus. 
Requirements for publishing a blog series will likely be stricter for this reason.

## Writing tips

- Do not write too formal
- Try to use active sentences
- Alternate longer and shorter sentences
- Do not chain endless subordinate clauses
- Check your "speling" and "grammer" and read your own work carefully

This [index note pointing to writing principles](/zettelkasten/index_writing_principles) may be useful.

## Formal details for submission

- Ideally submissions are written in Markdown, otherwise I have to convert them
	* Markdown is EZ, have a look at the [cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- The static website is deployed using [Hugo](https://gohugo.io/). If you want to preview the website with your post locally, perform the following steps
	* [Install Hugo](https://gohugo.io/getting-started/installing)
	* [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
	* Make sure the `hugo` executable is in your path variable
	* Run `git clone https://github.com/EdwinWenink/personal_website.git`
	* Open the `personal_website` folder
	* run `hugo server` in that folder
	* Add your post to the `content/posts/` folder 
	* Preview in your browser on `http://localhost:1313/`
* Submit your post either by mailing me or by a pull request on GitHub
	* If you want to make a pull request on GitHub, send me the name of your GitHub account so that you can set up a branch
- Optional: provide your GitHub account if you want to customize your personal page

