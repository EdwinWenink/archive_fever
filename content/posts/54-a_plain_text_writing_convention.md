---
title: "Two perspectives on a plain-text writing convention"
date: 2021-03-12T15:44:29+01:00
draft: false
authors: ['Boris van Meurs', 'Edwin Wenink']
guest: true
tags: ['vim', 'workflow']
---

Many Vim users, if not most, are programmers.
Many of the blogs you will find online about Vim are geared towards programming, along the lines of: "what's the best plugin to use for turning Vim into an IDE".
On this website I've instead focused more on Vim as a tool for writers and note-takers.
But, having a background in programming and Unix as well, I took some typical Unix conventions to my writing in Vim (but these conventions are not necessarily specific to Vim).
I thought I'd share these with you briefly and explain their rationale.

One of the beauties of Vim is, however, that it's a tool you can make fit your own needs.
A philosopher and friend, Boris van Meurs, uses Vim for his daily note-taking and I thought it would be great if he'd offer a contraposition to my own considerations from the perspective of a writer.

## Edwin: One line, one sentence

Vim is a power tool in itself, but is even more powerful when integrated in a rich environment of Unix tools. 
To offer better integration with common utilities in Unix-y ecosystems, I stick to the following convention: 

> *One line, one sentence.*

I'm a quite firm believer in this convention and usually go to lengths to convince collaborators to stick to it as well.
Of course, this convention does assume you are writing in markup or markdown where line breaks do not end up in the final text (such as `latex`).

A first argument for this convention is that most command line utilities operate on lines.
`grep` is a classic example. 
If you `grep` a file on a particular search pattern, this tool will return you all matching *lines* (not sentences).
Now, if you write a long paragraph on a single line (so without any hard breaks between sentences), `grep` will return a large blob of text for each search hit, not the actual sentence in which the search pattern was found.
Especially when `grep` is just the beginning of your pipeline and you want to perform some further actions on the search results, this may be undesired behavior.

Secondly, having one sentence per line also makes collaboration easier.
When I have ten sentences in a paragraph all on the same line, I'd end up saying things like "the sixth sentence on line *X*, that starts with *Y*".
When instead I have a sentence per line, I can just mention the line number without any ambiguity about which sentence I'm talking.
If I want to do some operation on that sentence, I can just directly apply it to that line as well.

Thirdly, a more practical point is that navigation in Vim is easier with one sentence per line.
For example, again consider the case that you have a paragraph of ten sentences on a single line. 
Now try to navigate efficiently to the sixth sentence.
If you have one sentence per line, this can be done with `5j`.
If not, you have some options but they are all a bit more laborious.
Some people may be tempted to scroll through the line to the location of interest. 
When softwrapping lines, you can also traverse *visual* lines with `gj`.
You can  of course also use forward search with `/` to jump to the sentence of interest.
Besides, Vim is smart and still knows what a sentence is, so you can skip five sentences with `5)`.
But all these things take a bit more cognitive load (for me at least).
For one, it will be hard to see how many sentences you have to skip ahead, whereas with one sentence per line that's easy to see, especially when  line numbering is enabled with `set number`.

In general, sticking to the convention will just lead to behavior that is semantically a bit more consistent.
Common shortkeys like `dd` will delete a single sentence instead of the whole paragraph.
When you actually want to delete a paragraph, I think it's semantically more clear and just as easy to leverage Vim's understanding of what a paragraph is and do `dip` (delete inner paragraph) or `dap` (delete around paragraph).
Similarly, it is more consistent when `j` actually moves you to the next sentence and not the next paragraph, for which Vim uses the curly bracket `}`.

Fourthly, an even more practical point is that Vim tends to slow down for very long lines, amongst other things due to syntax highlighting.
I enjoy that Vim feels snappy and lightweight and I like to keep it that way.
Boris will mention some workarounds for this particular issue though.

## Boris: One line, one paragraph

Unlike Edwin, I do not use VIM for writing code but for text writing. I write my philosophy dissertation in a TeX-file that I edit with VIM (and vimtex). About a year and a half ago, I was still using MS Word for this, as so many unenlightened folks are in their dimly lit caverns of Untruth, unaware that my salvation was close. 

My epiphany came when Edwin converted me to VIM as a useful tool for writing my philosophy dissertation. After figuring out how to efficiently write LaTeX in VIM with vimtex, I now use it for every step of the research process: from taking notes to painstakingly constructing the body of my arguments. For this, I always stick to the following convention:

> *One line, one paragraph.*

This means that I just keep typing away on a single line of code until I think I am ready to wrap up my paragraph. Why do I choose to do so from a writer's perspective? 

Well, first, in the way that I use VIM, I do not have much advantage of Edwin's paradigm when it comes to collaboration, navigation, and semantics:

- In my lonely lot as a philosophy researcher, I do not get to collaborate with anybody. And at the seldom occasion that I do work together on a text, chances are that this person is so used to MS Word that she will freak out if I would suggest working in other software like LibreOffice, let alone VIM. 
- As to navigation, I can navigate on a macrolevel using vimtex's table of contents, and on a microlevel using "/". That suits my purposes, and I barely ever pay attention to what number any line is. I simply do not encounter situations in which this is necessary. 
- The only disadvantage for me is that I am less flexible when it comes to semantics, but VIM is flexible enough to work around this. To use Edwin's example: I cannot easily use "dd" to delete a single line, but then I just use "d\$" or "dt." Still so much better than MS Word. 

So, given that the advantages of Edwin's method are not very effective on me, what *are* the advantages for me of sticking to one line per paragraph? 

1. First, it helps me to build my paragraphs. When I write my text I always start thinking from structure: each sentence should add something to the development of the core message of a paragraph (yes, I am now overanalyzing this paragraph while I am writing it and, no, I do not think it is perfectly structured). I can do this more easily if I actually see the sentences embedded into the text that it will be a part of. Admittedly, this can, strictly speaking, be done by Edwin's method, but one needs to put effort in visualizing how the sentences will look when assembled, which distracts me from writing. 

2. Another big advantage is that this method is a bit of cheating in that it makes VIM comes as close to 'what you see is what you get' as possible. It also helps me to put myself in the perspective of the reader, who, ultimately, is my sole judge. Perhaps when writing code this is not so important, but I really need to pay close attention to how my text will appear. It is easier if VIM helps me in this, without me having to compile my text, which complicates things as you are scanning two files at the same time. 

To go short, using VIM as a text editor, I prefer to write entire paragraphs per line to help me visualize the end result of the text. Writing is an exercise in empathy with the reader. This exercise is easier when the text is already displayed in the form of soft-wrapped paragraphs rather than choppy single lines. 

### Issue

There is a recurring issue when writing long lines when using vimtex. It gets slooooooow. Like, really slow. Especially in navigation modus, the screen is laggy when one attempts to jump through the lines and the paragraphs. 

Of course, this is unacceptable, as Edwin also mentions, because many of us use VIM for its light-weight nature. Actually, I myself started writing my PhD to avoid lag in LibreOffice (even before my MS Word days), which took ages to load the large number of references I had included using the Mendeley plugin. 

If the cure for slowness is more slowness, one has not proceeded much.

Luckily, the solution is simple in this case. What turned out to be the issue was that vimtex's syntax highlighting can mess things up. It is easy enough to fix this.

Just add: 

```
let g:vimtex_matchparen_enabled = 0
```

to your .vimrc. 

That fixes it. Quite simple, right? 

Enjoy using VIM! 
