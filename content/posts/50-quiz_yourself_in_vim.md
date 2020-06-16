---
title: "Study Tip: Quiz yourself in Vim"
date: 2020-06-16T16:21:08+02:00
draft: false
tags: [vim, note-taking]
---

I haven't written much for this website recently because it's *that* time of the year again: exams and project deadlines.
Here's a taster of what's going on in my studies: experimenting with gradient boosting decision-trees for forecasting; writing about Bayesian approaches to inference to the best explanation; developing and testing a podcast app; programming autoencoders, a GAN, and learning about generative modeling; writing an ethics policy brief on an AI-related issue.

This is also the first real stress test of my note-taking system and a chance for me to evaluate if I can pick the fruits of my labour.
Did consistently putting effort into my note taking system promote comprehension? 
Retention? 
Does it help me study more effectively?
Especially now that the Covid situation resulted in an abundance of take-home exams, perhaps my notes will share in some of the heavy lifting.

What I can already report on in any case, is that taking notes in Vim makes studying more enjoyable.
I'm not just studying for this one exam, to get this one grade.
Instead, I care about adding interesting thoughts and connections to my beehive of notes.
They may come in handy many years into the future.

However, when taking notes of lecture material I make my notes in a different style than usual.
Even though I still isolate interesting concepts and solidify them into their own note ([the principle of atomicity](https://zettelkasten.de/posts/create-zettel-from-reading-notes/)), my lecture notes are generally way longer than Zettelkasten-style notes.
Another thing I like to do - and this is topic of this post - is to leave questions for myself throughout my notes.
I consistently do that using an extremely simple convention: I leave a **Q** in bold in my study notes with the question.
I make all my notes in Markdown, so in plain text that looks like `**Q**`.

You will never write `**Q**` in a normal sentence, so this term is really easy to search on without getting "false positives".
To review these questions, just do a quick `vimgrep` on the current file.
You don't need fancy search tools if you just search the current file. 
I just make a quick mapping `\nq` ( '\\' is the default leader key) with the mnemonic "note quiz".

```
nnoremap <leader>nq :vimgrep /\*\*Q\*\*/ %<CR>
```

It looks a bit awkward because the asterix needs to be escaped in order to not be interpreted as a regex wildcard.
This just searches for our pattern in the current file (indicated in Vim with `%`) and does not need our confirmation (`<CR>` "presses" Enter for us). 
By default, `vimgrep` populates the `quickfix` window with the search results and opens it automatically.

I like that the question is previewed at the bottom of your screen like this:

```
(1 of 8): **Q**: Why is the triangle mesh so useful for real-time rasterization?
```

You can navigate the study questions with `:cnext` (`:cn` for short) and `:cprevious` (`:cp` for short).
If you accidentally close the window, you can reopen with with `:cwindow` (`:cw` for short).

Okay, *now forget this again*.

Just install [vim unimpaired](https://github.com/tpope/vim-unimpaired) which maps `:cprevious` and `:cnext` to `[q` and `]q`.
This is *perfect* for our purpose, because we can read these mappings as "previous question" and "next question".
The square brackets do not look intuitive, but you get used to them in a few minutes. 
Notice that the opening bracket is on the *left* of the closing bracket on an English keyboard, so that "left" corresponds to "previous", and "right" to "next".

By the way, I often also answer my own study questions below the question.
This is not a problem, because jumping to a question will usually display it at the very bottom of the screen, so I can't accidentally have a sneak peak at the answer.

Of course you can do this better, and you can extend it easily to also search other notes.
I currently have no need for that, and I really wanted this to be a ten second hack.
After all, I'm supposed to be studying now!

### N.B.

You can of course also write a script to collect the questions and dump them in a file.
On Unix-like systems, you could do something like this:

```bash
if [[ -e $1 ]]
	then
		filename="Questions $1"
		count=$(grep -Fc '**Q**' "$1")
		report="$count Questions extracted from $filename"
		printf "# $report \n \n" > "./$filename"
		grep -Fn '**Q**' "$1" | sed -e 's/\*\*Q:*\*\*:*//g' | sed -e 's/^/- /' >> "$filename"
		echo $report 
	else 
		echo Provide a file as an argument
fi
```

I wrote that script maybe two years ago and didn't bother to check it again, so use at your own discretion. 
