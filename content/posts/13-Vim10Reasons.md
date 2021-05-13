---
author: "Edwin Wenink"
title: "Ten reasons for using Vim"
date: 2018-11-06
draft: false
tags: [Vim, Workflow, Text editing, Efficiency]
series: ["vim and workflow"]
---

Vim is a well-known (and infamous) text editor that is designed in such a handy way that some programmers even use it as their preferred IDE (Integrated Development Environment). 
That is quite remarkable if you think about it for a second: why would people replace proper software solely built for everything related to programming with a *text editor*?
Apparently, Vim does text editing so well that people are willing to work around the limitations of using a "normal" text editor.
That is a very interesting fact to me, because as a philosophy student I spent years editing texts. And I regret that I did not know about Vim earlier.

It feels like I lived in the stone age. 
By starting a second bachelor in Artificial Intelligence, a significant dose of programming entered my daily life. 
But, being a caveman, I initially followed all my programming courses *without owning a laptop*. 
After a fair bit of working on other people's computers and emailing myself code (ouch...), I bought a second (or 3rd, 4th) hand Thinkpad T420 from a [friend](https://www.alextes.me), with Antergos, an Arch Linux distro, installed on it.
Over time I increasingly enjoyed customizing my workflow, and soon I saw myself disposing of my desktop environment and getting into the business of terminal multiplexing.
But one painful remainder in this workflow optimization was my philosophy work: for text editing, MS Word on my Windows desktop was still my go-to program.
In the meantime I was figuring out how to give shape to my remaining philosophy work next to a full-time study in AI.
The activity of writing and text-editing was still secretly the thing I liked the most, but I didn't get around to it anymore that often.
So I thought: why not also have a programmer's approach to text-editing as well?
Exploring Vim was my way of mediating between my desire to write and my newfound daily life.

The main goal of this blog post is to convince you that Vim is not only useful for programmers and coding, but also for text editing of all sorts: from making notes, writing proza, to producing papers. 
It only requires familiarity with some basic concepts that might be unfamiliar to you, and a willingness to learn.

## Vim's basic philosophy


Before I give you my ten reasons to use Vim, I want to explain how Vim effects what you could call a paradigm shift, and how this leads to confusion. The first experience that developers often have with Vim is that they enter it by accident, and then have no clue how to exit it. The popular platform Stack Overflow even wrote a [blog post](https://stackoverflow.blog/2017/05/23/stack-overflow-helping-one-million-developers-exit-vim/) about how a million developers visited a popular thread on how to exit Vim.
I was one of those people. After having used Vim for a while now, I would summarize the paradigm shift creating all this confusion as follows:


> In Vim inserting text is of secondary importance to efficiently navigating your text

In your usual text editor, when you type a letter, the letter appears on the screen.
As trivial as this may seem, this does not hold for Vim. Vim has different modes to manipulate a text, of which the "Insertion" mode is one among others, and not the default one.
In order to make letters appear in your text, you first need to enter Insert mode. 
And here is the trouble: in order to exit Vim, you first need to exit this Insert mode, and enter Command mode to give the `q(uit)` command.

<figure>
	<img align="right" style="width:40%; margin: 10px 20px" src="/images/13-blog/exitvim.jpg" />
</figure>

Inserting characters is a very straightforward operation where each keystroke corresponds to the inserting of a character on the screen. But by making this a secondary mode, Vim opens up the whole keyboard for highly efficient text navigation and manipulation. Think about this: when you write a document in MS Word, how much of your time do you actually spend typing, and how much time do you spend clicking, scrolling, dragging, and going through menu's with your mouse? You'd be surprised.


But this different paradigm takes a while to get used to, and initially you wonder why something so simple as editing a text has to be so seemingly complex.
But once you get comfortable with the basic logic behind Vim, you will never cease to be surprised how Vim can do things of which you did not even realize they were inefficient, more efficiently.
I will try to give examples of that in a follow-up post.


## My ten reasons for using Vim

**1) Improve efficiency**

The main reason for using Vim is that it enables more efficient text editing due to its numerous commands.
If you take for granted that Vim does this for a second, you might ask: but at what cost? Do I need to learn a hundred special commands? 
The answer is yes and no. Vim commands for text navigation and manipulation follow a basic grammar and are mnemonic. 
This means that if you learn some basic operations and a simple rule how to combine them, the amount of commands at your disposal grows exponentially. 
It is not hard to remember those basic operations, because they make sense.

**2) Focus on the content (and think about the view later)**

Vim and its ecosystem of plugins offers practically all the functionality you need, but without unnecessary bells and whistles. 
Traditional text editors such as MS Word have many menu's, tabs and buttons. 
It usually takes me a while to find what I need exactly, but what annoys me more is that all these menu's are distracting and take up a lot of screen space.

Vim instead helps you focus on what you want to get done without distraction. It provides you with a empty screen, and magic keybindings to perform text wizardry.
Vanilla Vim only shows some very minimal and crucial information, for example in which mode you currently are. Okay, gVim (Vim's graphical version) has a toolbar, but you can easily delete it completely.

`Q`: Let's say you wrote something in Vim, but the only thing you now have is plain text. In MS Word everything immediately looks "right". I type it, see it, and when I print it, it looks the same (usually) on paper. How do I get nice documents when writing in Vim? 

`A`: You are used to a [WYSIWYG-editor](https://en.wikipedia.org/wiki/WYSIWYG) where content and view are presented on the same screen. But this is not the only way. Typesetting systems such as LaTeX require you to first define and structure your content, and then later magically compile your text into a really nice looking document. The only thing you have to do is indicate your preferences for how you want your document to look like, but you only have to do so once.
After that you won't have to spend a second thinking about it, so that you can focus on the content.

Unfortunately, LaTeX syntax can be quite cumbersome.
If you do not require complex typesetting, a good option is writing in Markdown, which is an extremely easy format (you literally know how to work with it in 5 minutes), and it still has enough structure to create nice looking documents using everything HTML has to offer. This blog post is for example written in Markdown. When I deploy my website, the styling is applied automatically without me lifting a finger.

But you can also get the best of both worlds: the simplicity of Markdown, with the beauty of LaTeX. I personally write all my study notes in Markdown, and then use the amazing tool [pandoc](https://pandoc.org/) to create a nice looking pdf file with the good looks of LaTeX. Pandoc does this out of the box, but allows you to define your own LaTeX templates for converting markdown into pdf using a LaTeX engine. The other day I made my own template for compiling my study notes just the way I like it.

**3) Universally readable file type without compatibility issues**

Did you ever try opening a .docx document with a plain text editor? Everyone uses .docx because everyone uses MS Word. But .docx is only readable as intended through MS Word (let's forget about OpenOffice for now). So everyone keeps using Word (and paying for it). 

But then Microsoft decides that they are going to update their file format. 
You don't really know why that would be better, but people around you buy PCs with Windows and Word pre-installed and suddenly they start sending you their documents in this new format. But your old version of MS Word does not support this version, so you have to buy the newest version (be part of the trend or get out).

None of this in Vim. Vim does old school plain text editing. 
Everyone can read and edit it with their program of choice, and you will not be bothered by compatibility issues.

And there are some more advantages to this:

**4) Version control on your texts**

Using plain text for your writing opens up the possibility to use adequate version control on your documents, for example using git. 
You can integrate git in Vim by using plugins, for example [gitgutter](https://github.com/airblade/vim-gitgutter), which indicates all changes in your text. 
On top of that, since you can run shell commands from within vim with the `!` operator, you don't even have to leave vim to run your git commands.

Programmers are already used to using tools like git, but why do people in the social sciences not exploit the amazing tools available nowadays? How most people do version control (if at all) is by simply having various different versions of the same document, and numbering them. Have fun keeping track of which of the numerous versions had all the correct changes in it!

Also, git is free. Which brings me to the next advantage of Vim.

**5) Vim is completely free (okay, Charityware).**

Vim is free, but comes installed with the friendly mention that if you want to give something back, you should consider donating money to a charity supporting orphan children in Uganda.

**6) Vim is cross-platform**

The files you write in Vim are readable by everyone, but on top of that vim (or gVim) is available for all major operating systems.

**7) Highly extendable, fits whatever workflow**

Vim is highly customizable to your needs, and there are numerous plugins available for all kinds of purposes. Do you want to use Vim as an IDE? Sure, you can setup autocompletion, automatic bracket closing, function and variable tags, file exploring, syntax checking and highlighting for your language of choice, etc. You are not a programmer but you like writing proza? Sure, install for example Goya and Limelight for a smooth and beautiful writing experience.

And one thing to not forget: you can run shell commands without leaving vim using the `!` command. This means that whatever commands line tools you use, you can integrate vim in your usual workflow.

**8) Vim (or at least vi) is ubiquitous**

After learning Vim / vi keybindings, you will find that you can start up Vim on practically every Linux machine you will encounter.
No hassle. Even if you need to do something on a remote machine terminal: vi will be there. Vi-bindings are so popular that you will see them appearing in other applications as well.

**9) Vim is ergonomic**

Vim allows you to do your work without ever having to move your hands away from the keyboard. 
I spent quite some time behind my computer, and not having my hand on the mouse continuously really helps me reduce stress on my right shoulder. 

**10) Have fun learning**

Perhaps the best influence vim has on my workflow, is that *whatever* I do with Vim, it will indirectly be part of the bigger learning experience that Vim is. So Vim actually is a strong motivational factor for me. For example, taking notes is tedious, but now I see it as an opportunity to improve on my skills, and most importantly, enjoy the skills I have gathered so far.

The only downside is that sometimes you go down the rabbit hole looking for new Vim tricks.

I will write a [follow-up post](https://edwinwenink.xyz/posts/14-vimbasics) for some examples of how basic Vim use already helps me improve my efficiency.
