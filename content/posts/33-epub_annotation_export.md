---
title: "Two methods for exporting EPUB annotations (.annot)"
author: "Edwin Wenink"
date: 2019-09-01
tags: [epub, kobo, annotations, workflow, python]
series: ['Programming']
---

See [here](/posts/53-update_kobo_annotation) for a follow-up.

My personal goal for this summer break was reading more, as I really enjoy it but do not schedule enough time for it during the many hectic days throughout year. 
I always enjoy reading a book, but somehow the threshold for doing some project behind my pc is lower than simply sitting down in a chair with a good book.
A complication for reaching my goal was however that I would go backpacking for three weeks throughout Europe. 
I needed to pack very lightly, and even bringing a single book would be a major compromise to that. 
This is where, despite being a bit of a chauvinistic philosopher that prefers the touch of "real" books, the e-reader comes into play.
I purchased a Kobo Clara HD, and I have to say that the experience has been great.
During my travels I finished "Crime and Punishment" from Dostojevski, read "Slaughterhouse Five" from Kurt Vonnegut, and read half of the uncomfortably thick "The Brothers Karamazov", also from Dostojevski. 
And even now that I am home I notice how much easier it is to pick up the e-reader, compared to a book. 

During reading, I made many annotations and notes on my Kobo. 
Now that I am home, I was wondering how to export these notes to my pc, because that would save the trouble of manually finding back citations on the Kobo itself, which is slow, and perhaps typing them over by hand, which is even slower.
To my surprise, there was no default exporting option for annotations. 

## Method 1: adjusting the Kobo configuration file

A reddit user however found [a solution](https://www.reddit.com/r/kobo/comments/7swz6v/exporting_highlights_and_comments/).
This solution was suggested for another Kobo version, but also works for my Clara HD.
I summarize the solution here for completeness:

1. Connect your Kobo to your computer.
2. Find and open "Kobo eReader.config" in the Kobo drive. Mine is at /.kobo/Kobo/, relative to the root of your Kobo e-reader.
3. Add the following code, including the newline. 
This section is brand new, so it's probably easiest to just add it at the bottom of the file:

```
[FeatureSettings]
ExportHighlights=true
```

3. Eject Kobo and boot it up. 
4. This adds another option in the menu that is available when reading books, namely to "Export highlights" under the "Notes" tab. After entering a filename the annotations will be saved to the root directory of the Kobo.

The export function produces a plain text file, starting with the title of the book, followed by a separate paragraph for each annotation. 
Notes are displayed in a similar manner, as such: 

	The original citation goes here
	Note: this is my smart comment 

And voila!
With this method you have fast access to all your annotations in an open text format, so you can directly use it in an editor of your choice. 

## Method 2: customize the exporting to your own needs by parsing the annotation files 

However, if for some reason you want to export your annotations in a different manner, 
then you can always find the full xhtml markup with all annotations at "/Digital Editions/Annotations/books/".
If we inspect it, we see that the xhtml does not really contain much more relevant information than we already exported.
Per annotation, we also have the date at which we made the annotiation, as well as some non-human-readable identifiers. 
Having the date of an annotation is not essential, but if you intend to archive your notes, dates would give insight in your lecture of for example a few years back, and add some flexibility.
One could for example later sort the notes on date to distinguish notes from a first and a second reading. 

What I would have liked to include in my export was some more structure, for example grouping notes by chapter. 
What I also think is weird with the default export, is that the author of the book is never listed, and neither is the publisher of the book, which is handy for later reference.
Another argument for writing our own "export function" is the possibility of immediately using a specific output format of choice.
For example, I currently store my notes in Markdown on Github, so we could export the notes immediately using Markdown syntax.
Another idea is to at least number the annotations, given the absence of an ordering in chapters and the unavailability of a meaningful page numbering with the epub format.

If someone knows how to parse chapters and pagination from .annot files, please hit me up!

### Solution with a Python script

The annotation files with the .annot extension are written in xhtml.
For parsing xhtml we can use the lxml xml parser. 
Consider this remark on [their site](https://lxml.de/parsing.html):

> Note that XHTML is best parsed as XML, parsing it with the HTML parser can lead to unexpected results.

I like using Python, and luckily Python has a nice package called BeautifulSoup that offers a simple interface for using the lxml parser.

The Python script I wrote extracts the title, author, publisher and writes them to a file in the YAML format, which can be used within Markdown files and is supported both by Github Markdown and Pandoc Markdown (the two dialects I use).
Pandoc's default LaTeX engine for producing pdf files actually knows how to read the YAML entries and display them as a default LaTeX titlepage, which allows you to directly create a smooth pdf without writing any LaTeX. 

The script also distinguishes between annotations and notes, and displays them differently.
All annotations are displayed in a numbered list.
Notes are indented as block quotes, directly below the annotation to which they belong. 
Because the list itself is also already indented, I double the indentation as such "> > ".
In Pandoc Markdown this adds extra indentation, in Github Markdown the extra ">" does not do anything, but is also not necessary since blockquotes receive a different color on Github. 

This is the script:

```Python
import os
import sys
from bs4 import BeautifulSoup

args = sys.argv[1:]

if not args:
    print('usage: kobo_export.py filename')
    sys.exit(1)

filename = args[0]

try:
    with open(filename, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "lxml-xml")
except FileNotFoundError:
    print("The annotation file was not found")

title = soup.find('title').get_text()
author = soup.find('creator').get_text() 
publisher = soup.find('publisher').get_text()
annotations = soup.find_all('annotation')

# YAML metadata
metadata ="""---
title: {}
author: {}
publisher: {}
---

""".format(title, author, publisher)

export = []
export.append(metadata)

for i, annotation in enumerate(annotations):
    date = annotation.date.get_text()
    citation = annotation.target.find('text').get_text()
    export.append('{}. "{}" ({})\n\n'.format(i,citation, date))
    note = annotation.content.find('text')
    if note:
        export.append('> > ' + note.get_text() + "\n\n")

with open(filename + ".md", "w", encoding="utf-8") as output:
    output.writelines(export)
```

The result looks good in plain text, on Github as well as a pdf when produced from the Markdown with pandoc. 
Consider these extracted annotations from Emil Cioran's very gloomy youth work: 

### Plain text:

<pre>
---
title: On the Heights of Despair
author: E. M. Cioran
publisher: 
---

0. "In illness, death is always already in life. Genuine ailment links us to
metaphysical realities which the healthy, average man cannot understand. Young
people talk of death as external to life. But when an illness hits them with
full power, all the illusions and seductions of youth disappear. In this world,
the only genuine agonies are those sprung from illness. " (2019-08-26T11:46:10Z)

...

6. "The vulgar interpretation of universality calls it a phenomenon of quantitative
expansion rather than a qualitatively rich containment." (2019-08-23T10:19:09Z)

7. "Each subjective existence is absolute to itself. For this reason each man lives 
as if he were the center of the universe or the center of history. Then how could
his suffering fail to be absolute? I cannot understand another's suffering in
order to diminish my own. " (2019-08-24T08:21:54Z)

8. "One of the greatest delusions
of the average man is to forget that life is death's prisoner." (2019-08-26T11:38:32Z)

... 

36. "The melancholy look is expressionless, without
perspective. " (2019-08-31T07:28:00Z)

> > De afwezige blik in het oneindige externaliseert de ruimtelijkheid 
die volgens Cioran intern bij de melancholie hoort

37. "The sharper our consciousness of the world's infinity,
the more acute our awareness of our own finitude" (2019-08-31T07:29:48Z)

</pre>

### Github

See [this gist](https://gist.github.com/EdwinWenink/42ebcaf972ff4bbabda31fbc4f8b3516).

### Pdf through LaTeX

![](/images/33-blog/annotation_pdf.png)

![](/images/33-blog/annotation_pdf2.png)
