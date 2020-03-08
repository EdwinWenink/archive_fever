---
author: "Edwin Wenink"
title: "Building a Note-taking System with Vanilla Vim"
date: 2019-11-24
draft: false
tags: [Vim, Workflow, Zettelkasten]
toc: true
---

Vim is my preferred tool for making notes and organizing my thoughts.
This posts explains how we can use Vim to build a personalized note taking ecosystem of interconnected notes, only using plain text.
I have some requirements for such a system.
I want:

- everything in plain text: future proof, portable, searchable.
- version control on my notes
- to be able to smoothly find notes and navigate between them
- a quick way of searching the contents of my notes
- notes to behave like hypertext: they can directly link to other notes
- to do everything within a single consistent context, i.e. never leave Vim to do basic actions.
- my note taking workflow to be cross-platform (for me: work both on Linux and Windows)
- to Keep It Simple Stupid (KISS)

This is my guide for achieving the above.
This guide assumes you make notes in Markdown, but you can adapt everything to your needs.

## Motivation

The overall goal is to start building a personal plain text ecosystem where notes are linked together in such a way that they do not only help me remember things, but also positively stimulate the process of thinking and writing.
If knowledge is your business (if you are a writer, academic, or something of the like) spending some time to optimize your note taking is worth it.

Ideas about how note taking structures your thinking are worked out by the Zettelkasten (indexing cards) system that I found while writing this article. 
See for example a quote from this post on the benefits of [extending your mind and memory through note taking](https://zettelkasten.de/posts/extend-your-mind-and-memory-with-a-zettelkasten/):

> Some note archives never move beyond a storage of thoughts and stuff you need for reference. If you connect your notes heavily by creating links between them, though, eventually your Zettelkasten will do more than fill memory gaps. Instead, it will improve the depth of your understanding.

Note taking improves the depth of your understanding for various reasons, but the least superficial is that writing down thoughts forces you to think more coherently by requiring you to make thoughts explicit.

Similar to how your ability to *teach* is a good indication of whether you understand the essence of something, just so is note taking a way to see if you really get the main point of for example a paper that you are reading.
There is a hermeneutical principle at work here. 
The philosopher Gadamer for example describes how *understanding* requires you to go into dialogue with whatever you are trying to understand. 
This implies that you make your pre-understanding or prejudice *explicit* so that it can can be challenged in dialogue with something other, whether that is another person with a different background in teaching or a book you are reading. 

So ideally notes are really an ecosystem rather than just a storage container.
Just collecting stuff is not the same as understanding it.
I really like the idea of ["communicating" with your notes](http://luhmann.surge.sh/communicating-with-slip-boxes) in the creative process, also worked out on the [Zettelkasten blog](https://zettelkasten.de/posts/zettelkasten-improves-thinking-writing/#cn:1). 
As you write down more notes and keep connecting them, your notes will gain complexity up to the point where, let's say a year later, you will find surprising connections between new thoughts and old notes.
In this sense your notes can really become this other party that you enter into dialogue with and a stimulant for creative thinking.

N.B. this post thus does not focus on more dynamic plain text notes, such as todo lists or agenda's. 
Vim doesn't try to emulate the functionalities of other types of software, but tries to do one thing well and then integrate with other tools dedicated to other purposes.
Having said that, doing *everything* in plain text is cool, but you should probably have a look at Emacs Evil Mode in combination with Org mode.

## Step 1: Create a single repository for your notes

Because I want version control on my notes, it makes an awful lot of sense to organize all my notes in a single directory so that I can straightforwardly use Git. 
You could distribute your notes over your system and still have version control using a tool like GNU Stow, but this effort is not worth it for me. 
Keep It Simple.

Additionally, this way you can easily organize your notes with a meaningful folder structure that is easy to remember and efficient to navigate, assuming that you will have a folder structure at all.

## Step 2: Think about a folder structure for your workflow

After setting up your note directory, it makes sense to give some thought to how you are going to organize your notes within that directory.

There are many systems for organizing your life that rely on various forms of note taking.
This is not the main focus of this post, but here are some pointers to relevant methods: 

- [Getting Things Done (GTD)](https://nl.wikipedia.org/wiki/Getting_Things_Done#Collect)
- [The Organized Mind](https://en.wikipedia.org/wiki/The_Organized_Mind)
- [Building A Second Brain (BASB)](https://praxis.fortelabs.co/basboverview/)
- [Zettelkasten](https://zettelkasten.de)

These methods generally begin with decluttering your mind by writing things down.
There are plenty of online tutorials on how to implement these methods with digital note taking systems and tools, e.g. with [Emacs](https://tasshin.com/blog/implementing-a-second-brain-in-emacs-and-org-mode/).
We will do something similar in Vim.

Personally I have not (yet?) settled for a single note taking system. 
In the end it's all about finding out what works for your specific interests and use cases.

The Zettelkasten system for example urges you to only express a single idea in each note (atomicity) and rely heavily on tagging these ideas and linking them together with other notes.
This implies that it is futile to try to organize everything in folders. 
You instead rely on searching tags and following hyperlinks between notes.
Below I'll explain how I use Vim to follow those links.

I really do try to minimize sorting files, but in my case some folder structure is meaningful to me. 
Having done university courses of two curricula, philosophy and artificial intelligence, it makes sense for me to at least organize long form course notes per year, e.g. under /AI/Y3/ .

If you do project-based work, where projects last for example at least half a year, it would also make sense to me to organize those notes in a folder.
I have a separate directory for more free form notes.

Let's start with the implementation in Vim.

## Step 3: Create an index page

Because we have all our notes organized in a single directory, we can make an index as an entry point into our note taking system.

In the root directory of your notes, make a `index.md` file.
We are going to use this index file to make links to other files and directories that we can follow using Vim's awesome `gf` command.

The `gf` (go to file) command opens the filename, directory or url that is currently under the cursor. 
This means that we can populate our index files with relative paths to files that we often use.

Only use *relative* paths, because this makes our note system independent of any specific system.

For example, my index file contains a "quick start" menu for useful folders:

```
Quick start:

- Philosophy/Thesis

All directories:

- AI
- Philosophy
- Miscellaneous
- Workflow\ &\ Skills
- Epub\ Annotations
```

To to one of these directories all I have to do is place my cursor somewhere on the folder name and type `gf` to open the file in a new window (vertical split), or `gF` to open it in the same window, or `<C-w>f` to open the file in a horizontal split.
By the way, run `:help key-codes` for an explanation of Vim's notation for key sequences.

Paths with spaces in them can complicate matters. 
If you escape the spaces the `gf` command works just fine, the other commands not so much (in terminal Vim at least). 
What works in all cases is visually selecting the path before running `gf`.

Next to a quick start menu, I thought it was cool to include a full tree of all notes.
By default the tree command only shows the file names at nodes, but for `gf` to work we need valid paths.
Because all notes share the same root directory, we can save space by using valid relative paths.
On a Linux system, you can achieve this as such:

```
tree -f -I "images*|*.pdf|*.py|*.html"
```

The `-f` option displays the full paths relative to the root of the notes directory, which is necessary for `gf`.
The `-I` option excludes everything matching the given pattern.
I have some stray pdf, python and html files in my notes directory, so I make sure to exclude them. 
I also have one directory purely for images I reference in my notes.
All notes have the markdown extension (and an occasional Emacs `.org` file). 

To insert the output of the command directly in our text buffer, prepend the command with the `read` command or its shorthand `r`, or even shorter (but this overrides the current line), with `.` (a dot).
So you run:

```
:.!tree -f -I "images*|*.pdf|*.py|*.html"
```

The resulting tree looks something like this:

```

.
├── ./AI
│   ├── ./AI/Master
│   │   ├── ./AI/Master/AAPS-brainstorm.md
│   │   ├── ./AI/Master/AAPS-Chemero_Radical_Embodied_Cog_Science.md
│   │   ├── ./AI/Master/AAPS-Kwisthout_Frugal_Explanations.md
│   │   ├── ./AI/Master/AAPS-Lecture_Notes.md
│   │   ├── ./AI/Master/AAPS-Olivia_Scene_perception.md
│   │   └── ./AI/Master/AAPS-presentation_skills.md
│   ├── ./AI/Other
│   │   ├── ./AI/Other/ImageRecognitionWorkshop.md
│   │   ├── ./AI/Other/Jan_Broersen-ACAIS_Responsible_AI.md
│   │   └── ./AI/Other/lamachine.md
│   ├── ./AI/TA
│   │   ├── ./AI/TA/De_Graaf-How_People_Explain_Action.md
│   │   ├── ./AI/TA/Levy-Computers_and_Populism.md
│   │   ├── ./AI/TA/Meynen-Ethics_brain_reading.md
│   │   ├── ./AI/TA/Mittelstadt-Ethics_of_algorithms.md
    
. . . . . . . . . . .. . . . .  etc.

│       ├── ./AI/Y3/RI-Logic_Block.md
│       ├── ./AI/Y3/RI-Multi_Agent_Systems.md
│       └── ./AI/Y3/SEC-Lecture_Notes.md
│
└── ./Zettelkasten
    ├── ./Zettelkasten/BASB.org
    ├── ./Zettelkasten/environment.md
    ├── ./Zettelkasten/memory_techniques.md
    └── ./Zettelkasten/writing_principles.md
```

You can use this full tree for navigating to any note using Vim's `gf` command. 
To quickly jump to a file name in the tree, just use Vim's search `/` in the index file.

The last thing we need to do is make a fast way to access the index file from anywhere.
We can make a mapping to 1) open the index file and 2) change the Vim working directory to our notes directory, so that we can use our relative paths.

One way to do that is to add the following mapping to your `.vimrc`:

```
" Go to index of notes
nnoremap <leader>ww :e $NOTES_DIR/index.md<CR>cd $NOTES_DIR
```

UPDATE 19/12/2019: I now let all note related mappings start with `<leader>n`. 
This command is now mapped as `<leader>ni` for "note index."
This command also has a small mistake. This is the corrected version:

```
" Go to index of notes and set working directory to my notes
nnoremap <leader>ni :e $NOTES_DIR/index.md<CR>:cd $NOTES_DIR<CR>
```

N.B. the default leader key is the backslash `\ `.

`<CR>` is a carriage return, or an "Enter" in common tongue.
We need `<CR>` to also execute the command, but it is also a cheeky way to chain two commands together on a single line.

`$NOTES_DIR` is a bash variable that I set in my `~/.bashrc`:

```
export NOTES_DIR=/home/edwin/Documents/Notes
```

You can of course hardcore that path into your `.vimrc`, but I preferred to use the bash variable because then I don't have to change my `.vimrc` in case I migrate my notes directory for some reason.
On Windows I do hardcore the path though. 
Vim allows you to ignore the Windows convention of using backslashes in paths, so you can use a backslash to escape whitespaces as usual. 
For example, my remap on Windows looks like this: 

```
nnoremap <Leader>ww :e C:/Users/Edwin\ Wenink/Documents/Notes/index.md<cr>
```

Whatever we are doing in Vim, our notes are now always reachable within a second. 

## Step 4: Methods for finding notes

We can now quickly find notes by jumping to our index file, using Vim's search operator `/` and then running `gf` on the search result.

A more rhizomatic way of navigation is to create links within notes to other related notes and follow them with `gf`.
This is our method for building up an ecosystem of interconnected notes.

Another option is to use the default `find` function, which offers you autocomplete on paths. 
This is a feasible approach because all our notes are organized in a single directory with a meaningful structure.

Alternatively, just use a fuzzy file finder to quickly find files based on partial matches.
A well-known option is `fzf`. 
I opted for the `Ctrl-P` fuzzy finder because making that run on Windows as well was easy.

You can make Ctrl-P faster by letting it use the blazingly fast tool `ripgrep`, by adding the following to your `.vimrc` (after installing `ripgrep` of course):

```
" Make Ctrlp use ripgrep
if executable('rg')
    let g:ctrlp_user_command = 'rg %s --files --color=never --glob ""'
    let g:ctrlp_user_caching = 0
endif
```

Another good argument for using `ripgrep` is that it runs both on Linux and Windows and thus fits my cross-platform requirement.
Do note however that `ripgrep` is an external command line tool and does not ship with Vim, so you need to install it yourself. 
Have a look at the [project page](https://github.com/BurntSushi/ripgrep) for clear installation instructions.

Something I have not done yet, is design an effective plain-text tagging system [UPDATE 19/12/2019: see this post]( {{% parenturl%}}43-notes_tagging ).
[This blog](https://joereynoldsaudio.com/2018/07/07/you-dont-need-vimwiki.html) adds tags behind all files in the index, as a quick hack.
This doesn't fit with the above mentioned approach of automatically generating the navigation tree, as that would replace the tags. 
I also think a plain-text tagging system is ideally decentralized, i.e. tags are stored in the notes themselves. 
This is more robust but also tricker to implement efficiently.

## Step 5: Navigating between opened files in your buffer

We covered how to find a file you want to read or edit.
But how do you efficiently jump back and forth between files that you opened? 

Using search functions to find a file each time I need it is superfluous.
When I'm writing a paper I want to have various related notes open at the same time and ready for inspection.
But you shouldn't have multiple windows of tabs open for more than two files, first of all because they fill up your precious screen space and secondly because cycling through them is slow.

*You should use buffers* and the *jumplist* markers Vim sets for you.

Everytime you open a new file, Vim will open that file in a `buffer`.
It is important to realize that a buffer does not need to have a window, i.e. it is not necessarily visible.

You can see the complete list of open buffers using the `ls` command, which is familiar to all Unix users.
Alternative you can type out `buffers`.
You will see that each buffer is numbered. 
You can open a buffer quickly either by referring to its number, like so to open the second buffer `:b2`.

A very nice feature is that the buffer command can expand partial matches with filenames opened in a buffer.
If you for example have your `.vimrc` opened in a buffer, you can type `b rc<TAB>` to expand `rc` to the full path to your `.vimrc`. 

You can also cycle through buffers as such (with alternative mappings from `vimunimpaired`):

- `:bprevious` or `[b`
- `:bnext` or `]b`

And you can delete buffers from the buffer list with `:bd`
The command without arguments deletes the current buffer.

I have to admit that I only realized I wasn't using Vim's buffers properly after making a field trip to Emacs.
Sometimes it is good to explore a different workflow to re-evaluate your habits, and integrate improvements.
What was also more prominent in Emacs were functions to quickly jump back and forth between the buffers you visited lasts. 
I wish I knew that Vim could do this as well from the moment I started using it.

Vim uses movements to navigate through a text. 
Before each movement Vim sets a marker of your current location and stores it in the `jumplist`.
These markers also work *across* files. 

- With `C-o` you jump to the previously visited location.
- With `C-i` you jump one place to the front of the `jumplist`.

This means that if I open a new file in a buffer for example after using `gf`, then I can quickly jump back to the previous file with `C-o`.

If you perform movements in the meanwhile, you'll have to cycle back through those movements as well.
You can also directly alternate between the current file and the last opened file with `C-6`.
Somehow introductions to Vim rarely mention these commands, but they really were eye-openers for me.
I do not leave Vim anymore for file navigation, and especially on Windows this makes the whole experience much closer to using the command line.

Proper buffer navigation satisfies my wish to do everything from within Vim.
Without buffers, you'll find yourself opening new Vim instances all the time, which requires your window manager to switch between those instances.

## Step 6: Search contents of your notes

Additionally, in the case tag based search would not be enough (true in my case, because I did not implement it), we fall back on searching the contents of our notes.

The most straightforward tool to do this is `grep`, available on every Unix-like system.
However, we wanted our solution to be cross-platform and Windows does not have `grep`.

A first good approach is to use Vim's native `grep` called... `vimgrep`.
Because this doesn't require an external tool, any system using Vim can use this approach.
There is an issue though. 
`vimgrep` and `lvimgrep` (a `vimgrep` that populates the `locallist` instead of the cross-file `quicklist`) are **slooooooow**.

Luckily, Vim also has a regular `grep` command that you can configure to use any searching tool.
We just need that tool to be cross-platform.
We already used `ripgrep` for Ctrl-P, so let's use it for Vim's `grep` command as well.

```
" Make :grep use ripgrep
if executable('rg')
    set grepprg=rg\ --color=never\ --vimgrep
endif
```

Merge the new line with the code block for the `Ctrl-P` fuzzy finder we saw above.
The `--vimgrep` option emulates `vimgrep` behavior, i.e. it now returns each match, irregardless whether it's in the same file or sentence as another hit, as a single result.

The next step is to write a command with a handy shortcut to search our notes *and only our notes*.

I was inspired by a note searching function from [this video](https://www.youtube.com/watch?v=wh_WGWii7UE) of a doctor using Vim to make notes.
He uses the slow `vimgrep`.
This is his function:

```
command! -nargs=1 Ngrep vimgrep "<args>" $NOTES_DIR/**/*.txt
nnoremap <leader>[ :Ngrep
```

I introduced four changes. 
We do not use `vimgrep` anymore, but Vim's `grep` command which we redirected to `rg`.
But the syntax of `ripgrep` is different.
It does not take Unix style wildcards, but requires you to explicitly define a glob for the search pattern using `-g`.
I also changed the mapping slightly, using the "n" for "notes".
Instead of `.txt` files, we only search through `.md` files. 
Adjust the glob pattern if you want to include more.
Remember that the `<leader>` is a backslash by default.

```
" My own version, only searches markdown as well using ripgrep
" Thus depends on grepprg being set to rg
command! -nargs=1 Ngrep grep "<args>" -g "*.md" $NOTES_DIR
nnoremap <leader>nn :Ngrep 
```

So if we press `\nn` in Vim, we can immediately type our search term and get all matches in our note directory.

The results of the search populate what is called the `quickfix` list in Vim.
This is a list you can access from any context within Vim (as opposed to the `locallist` which is bound to the context of the current file).

You can use the following commands to navigate the items in the quickfix list:

- `:copen` and `:cclose` for opening the list
- `:cnext` and `:cprev` for jumping to next/previous list item
- `:cc {nr}`: to jump to item number and echo it
- `:colder` and `:cnewer` to also navigate older quickfix lists.

The [vim-unimpaired](https://github.com/tpope/vim-unimpaired) plugin provides default mappings for the quickfix list:

- `]q` for `:cnext`
- `[q` for `:cprev`
- `[Q` for `:cfirst` 
- `]Q` for `:clast` 

For who is into more advanced stuff, you can run commands on each item in the quicklist with `cdo {cmd}`, which runs `cmd` on every list item.

I was also inspired by the Vimming doctor linked above in the creation of a navigation pane for browsing the search results in the `quickfix` list.
The following function and mapping allows you to open a sidebar with the results from our custom "note grep" with `\v`: 

```
command! Vlist botright vertical copen | vertical resize 50
nnoremap <leader>v :Vlist<CR>
```

Clicking on a option moves to exact line in file of the search hit.

Sometimes I leave "TODO" notes in notes. 
This is how the custom sidebar looks after searching my notes for "TODO":

![](/images/42-blog/vlist_notes.png)

The sidebar shows the file a match was found in and a preview of the match itself.
You can adjust the size of the bar with `:vert resize {size}`.

## Conclusion and ideas for the future

The system described above only uses vanilla Vim functionality without the need for plugins.

I also deliberately do not use additional plugins for previewing my notes, because I write in Markdown and Markdown is designed to be readable in plain text. 
Instead I advice to explore the various Markdown plugins out there, for syntax highlighting and folding.

I'm interested in getting tips from you, especially about a potential implementation for "tags".

This is my current TODO list:

- Design a tagging system and related search functions
	* [UPDATE 19/12/2019: see this post]( {{% parenturl%}}43-notes_tagging  )
- Think more about the best file naming convention
	- e.g. use timestaming and write a function to search timeframes
* Write a function for quickly adding a new note
- Think more about my folder organization

If I work any of these out you can expect a new blogpost about that.

## Links for inspiration

- [Mark Koester - Plain text life](http://www.markwk.com/plain-text-life.html)
- [Mark Koester - Smart Notes](http://www.markwk.com/smart-notes.html)
- [Curated overview of Zettelkasten](https://zettelkasten.de/posts/overview/)
- [Joe Reynolds - You (probably) don't need Vimwiki](https://joereynoldsaudio.com/2018/07/07/you-dont-need-vimwiki.html)
- [Conner McDaniel - Vim notetaking tips](https://www.youtube.com/watch?v=wh_WGWii7UE)
