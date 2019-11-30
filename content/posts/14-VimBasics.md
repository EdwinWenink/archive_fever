---
author: "Edwin Wenink"
title: "Vim: Basic Text Navigation and Editing"
date: 2018-12-11
draft: false
toc: true
tags: [Vim, Workflow, Text editing, Efficiency]
---

## Basic navigation

I stated in a [previous post](https://edwinwenink.xyz/posts/13-Vim10Reasons/) that the main innovation of Vim is making the insertion of text secondary to navigation.
Let's put my money where my mouth is. The following assumes you are in normal mode.

It is useful to conceptualize a bit first. 
In MS Word text navigation is done mainly by 1) using the arrows, 2) mouse clicking, 3) mouse scrolling. 
Some expert Word users perhaps navigate between words and paragraphs by using Ctrl + arrow key.
In (pure terminal) Vim, navigation has to be done without the mouse. Are we then only left with the arrow keys, or `h j k l`?

Getting rid of the mouse forces you to think about navigation on different levels. 
There is navigation within words.
But also navigation between words within sentences, between sentences within paragraphs, between paragraphs within pages, and between pages/screens.
I leave navigation between files aside for now.
Only if you choose the appropriate level for your situation will text navigation in Vim be more efficient than for other editors.
When starting out with Vim you will probably be a bit inefficient, but over time reviewing your behavior should result in good habits.

**Within words**: on the lowest level you navigate with the basic navigation keys `h j k l`. 
Do not use the arrows, since this requires you to move your hand away from the central keyboard position.
To force yourself to do this, and simultaneously make the arrow keys useful for something, consider mapping your arrow keys to resize windows.

**Between words**: If you are editing within a sentence and want to jump to particular word, you have some options. 
You will notice that most key commands are easy to remember based on what they do.
If you want to jump towards the *end* of a word, press `e`. 
To instead go to the beginning, press `b`. So far so good.
To jump to the beginning of the next word, press the `w` from "word".
In long sentences this can still feel a bit inefficient, but you do have some options:

1) Repeat your command. E.g. to jump three words forwards, type `3w`.

2) Quickly find and jump to a character. If your cursor is on "Repeat" in the previous sentence, and you want to jump to the middle of the sentence, you could find 'w' with `fw` to end up at the beginning of the word "words". If you want to end up before that word, jump "to" or "till" it with the `t` command.

3) You can also quickly search and move to a word in a sentence if more convenient, for example when a sentence is long. Quickly typing `/wo` and pressing enter is enough to jump to "words". For backward search, use `?` instead.

If you want to jump to the beginning of the line, press `0`. Surprising?
This one is less obvious, but `$` moves towards the end of the line.

**Between paragraphs**: Use `{` and `}` to jump back and forth between whole paragraphs.

**Between pages/screens**: `^f` and `^b` goes forward and back a page. Capitalizing instead makes you jump a whole screen: `^F` and `^B`. (Note that '^' here indicates the CTLR button).

## Quick and dirty mode switching

After navigation, you most likely want to enter Insert mode. 
Vim offers commands for striking two birds with one stone; the birds being navigation and switching to insert mode.
These are the basic commands that I really miss the most when I have to write in something else than Vim.

When writing you often pause to review your last sentence and fix some small error.
Your cursor is in the middle of your last sentence, but now you want to continue writing on a new line.
And let's say that you are writing a first draft, so your last sentence is also the end of the file.
Take a moment and think about what you would do in MS Word.

I suspect something like this: 1) you go to the end of the sentence, either by pressing 'End' or by clicking on it with your mouse 
(in the latter case you have to take your hand of the keyboard).
2) You click enter to create a new line. 3) You can now start typing.
Ok, that's not too bad. But Vim does all of this with the command `o`, that *opens* a new line and leaves your cursor at its start. 
It doesn't matter if you are in the middle of the previous sentence. 

But Vim really does better in the scenario where you want to write a sentence *before* the currently selected sentence. 
In Word you would do: 1) move to beginning of the current line, 2) press enter, 3) go up a line, 4) you can now start typing. 
Vim still does all of this in a single keystroke. This does maybe not seem that impressive, but you would be surprised how often you will find yourself doing the previous if you pay attention to it.
The capitalization of a command often do a similar task slightly different. In this case `O` (so the capital) does all of the described steps at once. 

The same holds for `i` and `I`. `i` puts you insert mode, but `I` puts you in insert mode at the beginning of the sentence. 
Even more handy are `a` and `A`. `a` puts you in insert mode *after* the cursor, i.e. allows you to *append* text.
So if you quickly want to append something to a word, you type `ea` to append after the end of the word.
But often you want to append something at the end of the line. No problemo: `A` jumps towards the end of the line and leaves you in insert mode so you can immediately start typing. 
Notice that again there is some logic here that helps you remember this. Just like `I` does a similar operation but then on the line level, `A` does `a` but then for a whole line.
The `A` command is amazing. You can leave a sentence half-finished, correct a small error, and then continue where you paused with a single keystroke.

## Mastering the Grammar: Combining navigation and operations.

You can navigate, so what? Well, Vim has a grammar that allows you to combine navigational keys or "directions" with basic operations and text objects, like verbs combine with nouns and adverbs. The main importance of this is that once you understand the building blocks, you can combine them into sensible commands without the need to remember them explicitly. So again, even though learning Vim is daunting initially, it becomes easier when you study the underlying logic instead of haphazardly learning commands.

So what are Vim verbs? The most important ones are `d` for delete, `y` for yank (a.k.a. copy), `c` for change, and `v` for visual selection. And what are the Vim nouns? In the previous section I mentioned navigation on the level of words, sentences, and paragraphs. Well, guess what `w`, `s` and `p` stand for? Let's start combining:

- `dw`: delete until the beginning of the next word.
- `3de`: delete until the end of the word three times.
- `d0`: delete until the beginning of the sentence.
- `y$`: yank/copy until the end of the sentence.

But this language is still a bit limited. We can specify the basic commands, such as delete, a bit further with modifiers such as `i` (inside) or `a` (around) that specify the command relative to a text object. For example:

- `ciw`: change inside word; notice that normally `w` jumps to the next word, but now you do not want to change until the beginning of the next word, but instead want to change the word object inside which your cursor is placed.
- `dis`: delete inside sentence. Deletes the sentence object inside which your cursor is placed. N.B. `dd` is a shortcut that does the same.
- `yip`: yank everything inside the paragraph object we are currently in. No dragging and selecting: we just specify the logic and Vim does the work. 

And search functions `t`, `f`, `/`, and `?` are also navigational in nature, so why should they be treated any different?

- d/yolo: delete until the first match of the word "yolo"
- dtm: delete till the character "m" (so not including "m")

And even if you get creative, Vim often knows exactly what you mean.

- `ci"`: change everything inside the quotation marks. Nothing to remember here, it just does what it says.
- `da]`: delete everything "around" the square brackets (so including brackets).

All of this combined opens a completely new perspective on text editing. 
The main downside however, is that when you start using Vim you will counteract the gained efficiency by delivering unrequested preaches about how much more efficient you are now that you use Vim. 

In a follow up post I will focus on use cases less related to the act of writing itself and more to everything surrounding it.
