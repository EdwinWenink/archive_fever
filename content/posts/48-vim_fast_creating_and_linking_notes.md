---
title: "Easy creation and linking of Zettelkasten notes in Vim"
date: 2020-04-15T16:14:19+02:00
draft: false
tags: [Vim, Zettelkasten, note-taking, workflow]
---

This is the third post in a series of sorts about note-taking in Vim.
I have silently kept playing around with the system outlined in the previous posts ([-1]({{% baseurl %}}posts/43-notes_tagging/),[-2]({{% baseurl %}}posts/42-vim_notetaking/)).
Some things I have abandoned, some are improved and some are changed. 
I have inserted several updates (marked as "UPDATE") in the previous posts in case you are curious. 
If we have reached some sort of equilibrium at the end of this series I'll make sure to create a place where people can easily download all relevant configuration and used scripts, but until we've reached that point you follow along here. It's a matter of "voortschrijdend inzicht," a beautiful Dutch phrase that's hard to translate and certainly hard to pronounce for most of my readers.
Given the fact that my previous posts on Vim are well-received and several people are trying it out, it's time to pick up writing again and start chipping on the backlog. 

To give you a taster of what's to come: 

- various surprising uses of back-linking between files
- a script for automatically updating them *in-place* in a dedicated section each note
- exploring methods of visualizing relations between notes ...
- ... and ideally using this visualizing for some free-roaming navigation as well.

In this post, I want to discuss a seemingly minor issue that will nevertheless potentially have a big impact on your workflow. 
It concerns the quick creation of new timestamped notes in your note directory or Zettelkasten, and then easily creating a correctly formatted Markdown link to it from another note.
If you are impatient, you can have a look at the [screencast](#screencast) below.
If not, let me give a brief introduction to show you where the potential workflow issue is.

## What's the issue I'm trying to fix?

The authors of [this nice Zettelkasten blog](https://zettelkasten.de/) argue that you should give up trying to categorize your notes in hierarchical folders and throw everything into one big flat Zettelkasten.
This is scary, because notes that do not have many interconnections with other notes may be forgotten when the Zettelkasten gets big (it will be forgotten by you for sure, but also "forgotten" by the Zettelkasten itself if it lacks links).
Nevertheless, I'm making the transition because I want to commit to the idea of my note collection being dynamic, organic, an entity of its own, rather than it being a static dump.
In order to make this transition, you start to fully rely on your tools.
Since I'm hacking together my own tools, some issues came up.

The [OG Zettelkasten of Luhmann](https://niklas-luhmann-archiv.de/bestand/zettelkasten/inhaltsuebersicht#ZK_1_editor_I_45-11) had an extensive naming convention for organizing notes, but it was more of a necessary evil because computers were not in the picture yet.
Given that we now have digital means of naming, searching and linking notes, a strict naming convention for the notes is an unnecessary complication and blindly applies an "analogue" mindset to a digital solution.
The same authors are however strong proponents of the more superficial organization of notes by their time of creation, which they do by inserting a unique timestamp in the filename.
For me, the best argument for this approach is that unique timestamps are a good way of recovering links through potential filename changes. 
The main reason I did not use them was however that I used Vim's default filename/path completion (`C-x C-f` in insert mode) when making Markdown links.
This worked fine for me as long as filenames are meaningful, but this just doesn't cut it anymore when all filenames start with a timestamp, as you would have to manually start typing the timestamp.
An early adapter of my Vim experiment, [Boris](https://www.de-klos.net/), did however use long complex timestamps and noticed interlinking was getting in the way of his workflow.
Since he now makes all his notes for his PhD in Vim, I certainly do not want to be responsible for trouble!
So here it goes ...

## Create a timestamped Markdown note in your Zettelkasten

Before we solve the bigger issue, let's add some convenience.
When using timestamps, manually typing out the date and time is a pain in the ass. 
Each timestamp needs to be a unique identifier, so this means you at least also want to include the time of day, potentially up to the amount of seconds if you regularly make multiple notes within a minute.
I don't personally, but the code below is very easy to adjust to your own needs.

First, we declare a variable that holds the location of our Zettelkasten, so we may use it in multiple places without having to retype the whole path.

```
let g:zettelkasten = "/home/edwin/Notes/Zettelkasten/"
```

Now we want to define our own custom command that 1) pre-fills all the stuff we don't want to type, namely the timestamp and the extension (I always use markdown), and 2) prompts you for the name of your note:

```
command! -nargs=1 NewZettel :execute ":e" zettelkasten . strftime("%Y%m%d%H%M") . "-<args>.md"
```

This will produce a filename like "201704051731-my_awesome_note.md".
Don't bother with understanding this. 
Writing it certainly gave me a headache because I'm new to Vimscript.
What is interesting for you is "%Y%m%d%H%M" because it indicates how you want to format your datetime.
You can read about this by typing `:help strftime` and otherwise [this](https://vim.fandom.com/wiki/Insert_current_date_or_time) is a good resource.

Now all we have to do is declare a mapping to call our command. 
I use the "<leader>n" prefix for all note-related stuff I write myself, so I choose "<leader>nz", which just also happens to be a mnemonic for **n**ew **z**ettel.

```
nnoremap <leader>nz :NewZettel 
```

Done! 
Now let's solve the real problem of effortlessly linking to this note.
Warning: it gets pretty sexy ahead.

## Using fuzzy finding (CtrlP) to create formatted Markdown links to files

The main issue was that we never want to type timestamps in order to reap the benefits of path completion to get a Markdown link to the file we want.
Now that we are at it, having to format a Markdown link like \[description\]\(link\) also takes time, so let's automatize that as well.

My current solution is to rely on my fuzzy file finder (I use CtrlP with ripgrep, but fzf is also a great choice) to find a file and automatically create a markdown link to it.
This is a great solution because the fuzzy nature of it allows you to ignore the timestamp altogether.
But it also allows you to search on a partial fragment of the time *and* a part of the note title.
I can imagine you for example remember making a note about Zettelkasten somewhere in 2019, but you don't quite remember the exact date (unless you are Rain Man) and neither the precies name of the file.
No problemo! Boot up CtrlP and search on "2019Zettelkasten". 
We can extend CtrlP to then automatically create a markdown link to the matching file, with Ctrl-X.
Have a look at the [short screencast I made](#screencast).

I started with code provided in [this StackExchange post](https://vi.stackexchange.com/questions/8976/is-there-a-way-to-insert-a-path-of-the-file-instead-of-opening-it-with-ctrlp-plu) and adjusted it to create valid Markdown links:

```
" CtrlP function for inserting a markdown link with Ctrl-X
function! CtrlPOpenFunc(action, line)
   if a:action =~ '^h$'    
      " Get the filename
      let filename = fnameescape(fnamemodify(a:line, ':t'))
	  " TODO do not delete "-" when no timestamp is present
	  let filename_wo_timestamp = fnameescape(fnamemodify(a:line, ':t:s/\d+-//'))

      " Close CtrlP
      call ctrlp#exit()
      call ctrlp#mrufiles#add(filename)

      " Insert the markdown link to the file in the current buffer
	  let mdlink = "[ ".filename_wo_timestamp." ]( ".filename." )"
      put=mdlink
  else    
      " Use CtrlP's default file opening function
      call call('ctrlp#acceptfile', [a:action, a:line])
   endif
endfunction

let g:ctrlp_open_func = { 
         \ 'files': 'CtrlPOpenFunc',
         \ 'mru files': 'CtrlPOpenFunc' 
         \ }
```

I just love it. 
Irregardless of whether I will use timestamps in my filenames, this will greatly speed up interlinking notes in my Zettelkasten.

## Screencast

<video width="640" height="480" autoplay muted loop>
    <source src="/videos/48-blog/vimcast_ctrlp_links.mp4" type="video/mp4">
</video>

