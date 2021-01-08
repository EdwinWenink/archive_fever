---
title: "Extracting Kobo EPUB Annotations"
date: 2021-01-08T22:00:02+01:00
draft: false
author: Edwin Wenink
tags: [epub, kobo, annotations, workflow, python]
---

In a [previous post](/posts/33-epub_annotation_export) I outlined two methods for extracting annotation files from Kobo e-readers.
One method was to enable the Kobo export function.
Personally, I wasn't very happy with the default export format, so I also wrote up a quick and dirty code snippet that hinted how to write your own custom export script.
Personally, I want my notes to be formatted in Markdown so that I can easily convert them to pdf, html, or you name it.
My preferred tool for that is [pandoc](https://pandoc.org/).

There has been some interest in that script, so I decided to extend on it a bit.

## Getting the code

You can download the latest version of the script in this [github repository](https://github.com/EdwinWenink/kobo-notes).
You can either download the code as a zip, or clone the repository if you know how to use `git` with `git clone https://github.com/EdwinWenink/kobo-notes.git`.

## Usage

DISCLAIMER: the script works fine for my annotation files (Kobo Clara HD), but please note it is not extensively tested.

The script is written in Python 3, so you need that have that installed on your system. 
You can download Python 3 [here](https://www.python.org/downloads/).
The script mostly uses default Python modules, but you'll need to install the `BeautifulSoup` module.
To do that, open a terminal with access to your Python environment and run `pip install beautifulsoup4`.

To learn how the script works, open aforementioned terminal, and run (this assumes the script is in your terminal's current working directory) `python ./kobo_export.py --help` 
(on Windows the forward slashes are replaced by backward slashes).
This outputs instructions on the usage of the script:

```
usage: kobo_export.py [-h] [-f FILE | -d DIRECTORY] [-o OUTPUT]

Extract KOBO annotations as Markdown files

optional arguments:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  path to annotation file to process
  -d DIRECTORY, --directory DIRECTORY
                        root directory of all annotations
  -o OUTPUT, --output OUTPUT
                        location of output folder (default: current folder)
```

As you can see, all flags are optional. 
You can either select a single annotation file to be processed with the `--file` flag.
You need to provide a valid path to that annotation file.
Alternatively, if you want to process all annotation files in a directory, you can specify that directory instead.
In both cases, you can also specify a directory where you want the extracted markdown files to be placed. 

If you do not provide a file nor a directory, the script will recursively look for annotation files in the current folder and its subfolders. 
If you do not provide an output directory, all files will be written to the current directory.

Combining the options, running the script looks like this:

```
python ./kobo_export.py --directory "./Dostoyevsky, Fyodor/" --output ./markdown/
```

This reads all annotations files from Dostoyevsky and puts the extracted notes in a folder called 'markdown'.

On Windows I encountered an annoying situation. If you have a folder name with spaces (Kobo does this), then the backslash separator actually escapes the closing quote... 
If this happens to you on Windows, you can solve this as follows:

```
python .\kobo_export.py -d '.\Dostoyevsky, Fyodor\\' -o .\markdown\
```

## Formatting

The extracted notes will have a YAML header with meta information.

```

---
title: On the Heights of Despair
author: E. M. Cioran
publisher: Unspecified
---

```

With respect to the previous post I changed several things.
Extracted notes are numbered and sorted in order of occurrence. 
For some reason they weren't sorted before.
`0.280` is the progress indicator: the note was made at 28% progress in the book.
I now only display the date, without timestamp to avoid clutter.
By default there's a lot of weird line breaks in the quotes, so I sanitized that a bit.

Highlights without annotations look as such:

```

46. "Solitude is the proper milieu for madness." --- *0.280, 2019-12-31*

47. "In comparison with despair, skepticism is characterized by a certain amount of dilettantism and superficiality. I can doubt everything, I may very well smile contemptuously at the world, but this will not prevent me from eating, from sleeping peacefully, and from marrying." --- *0.288, 2019-12-31*

48. "On the heights of despair, nobody has the right to sleep." --- *0.288, 2019-12-31*
```

And annotations are displayed as such:

```

7. "X insults me. I am about to hit him. Thinking it over, I refrain.  Who am I? which is my real self: the self of the retort or that of the refraining? My first reaction is always energetic; the second one, flabby. What is known as “wisdom” is ultimately only a perpetual “thinking it over,” i.e., non-action as first impulse." --- *0.107, 2020-07-28*

> > Wisdom as non-action as first impulse

```

## Converting to other file formats

Because the extracted notes are valid Markdown, you can easily convert them to whatever text format using pandoc.
Pandoc is very simple to use.
The following command is an example of how to convert one of your notes to pdf.

``` 
pandoc mythoughts.epub.md -o mythoughts.pdf
```

Let me know below if there are any issues etc.!

