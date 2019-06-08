---
title: Dynamic BibTeX bibliography paths with spaces
author: Edwin
date: 2019-06-07
tags: [LaTeX, BibTeX, bibliography]
---

Although LaTeX is amazing in many aspects, I often encounter relatively small issues that somehow take way too long to fix. 
Today I encountered a very specific use case that gave me a headache, and I want to write up my solution so I never have to think about it again.

### The scenario

I'm currently working on my bachelor thesis for Artificial Intelligence, which is due in a week, so I have no time to waste.
My thesis lives in a github repo, so that I always have my latest work available depending on whether I work from my laptop running Arch Linux, or from my desktop running MS Windows. 
My bibliography file is also saved in that repo, so loading the bibliography file from LaTeX is as trivial as `\bibliography{thesis}`, which loads the file called `thesis.bib`.

**However**...

I'm using Mendeley as my reference manager, and in the past exported a group of references manually to a `bib` file. 
However, currently I'm updating my references very frequently so that manual copying becomes an annoyance.
It turns out that Mendeley has a BibTeX synchronization option that keeps `bib` files up to date automatically.
You can either synchronize one `bib` file for your whole bibliography, or create a `bib` file per group of references.
The latter option is appropriate for me, because I grouped together all references for my thesis.
Unfortunately, you cannot choose an export folder per group.
Instead, all `bib` files will be exported to a single directory.
It does not make any sense to store all my `bib` files in the repository for my thesis, so I had to put the folder somewhere else on my system.

*This is where the trouble starts*.
This situation created two issues for me. 

1. Because the bibliography file now lives outside the repository on my desktop, I would not have access to it on my Linux laptop without manually copying files again.
2. I now have to provide a path, but both my Windows path and the Mendeley export files contain spaces in them.


### Solutions

In order to solve the first issue, I loaded `\usepackage{ifplatform}`.
This allows LaTeX to do an operating system check.
But in order to do so, you need to give the compiler explicit access to your shell through a `shell-escape`.
I did so with the following command: 
`pdflatex -shell-escape -job-name="thesis" master.tex`

The idea is that I will specify the bibliography path both for my Windows and Linux system within a conditional, so that I can work on my `TeX` files from both systems without having to adjust anything.

Solving the second issue was a pain.
I had a lot of trouble making LaTeX deal with spaces in my Windows path.
This issue never occurred before because I can straightforwardly use relative paths that are completely contained within my repo and thus do not point to different directories on different systems.
Ultimately I found a solution that worked.
If you want to get around spaces in LaTeX on Windows, either 1) rename whatever contains the space, 2) use a legacy DOS path.

In order to get the DOS variant of your path, you have to open your command prompt (not PowerShell, it seems), and run `dir /x`.
Do this for all folders that contain spaces, as this path representation does not contain any spaces.
These paths however do contain '~', which you need to escape with `\string`.

Combining these two fixes produced the following solution:

```java
\ifwindows
\bibliography{C:/Users/EDWINW\string~1/Bib/ARTIFI\string~2}
\fi
\iflinux
% the bib command for linux
\fi
```

The Windows-style corresponding path was `C:\Users\Edwin Wenink\Bib\Artificial Intelligence-Bachelor Thesis`.
(Note how that also uses '\' instead, which is annoying because that is an escape sequence in LaTeX.

Okay granted, the easier solution would have been to go for option 1 by making Mendeley not export any spaces and then still go for relative paths... But that is a statement by Captain hindsight.
What I would have done ideally, is simply make a reference to my home folder with `~` like you would do on Unix based systems, but LaTeX doesn't support that feature and I could not find a quick hack.
Let me know if you do!
