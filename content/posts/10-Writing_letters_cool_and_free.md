---
author: "Edwin Wenink"
title: "Writing a letter the cool way... for free"
date: 2018-08-21
draft: false
tags: [Markdown, Pandoc, Latex, Linux, Writing]
---

Markdown and Pandoc are the preferred tools around which I design my workflow. For practically all writing I do, they get the job done properly, quickly and for free. For some applications with more delicate layout requirements, such as for example a letter or a resume, writing in Markdown is a bit limited. In those cases, if you subscribe to the philosophy that content and layout should be separated, you end up with writing in LaTeX. However rewarding the results of writing in LateX are, when you are used to writing in Markdown it just feels cumbersome. When I write something, I want to focus on the text with as little distraction as possible. In LaTeX I always end up googling because I made a small syntax error somewhere that prevents my document from compiling.

Luckily, there are some amazing people on the web with similar workflow ideas, and that are kind enough to share the hard work they put into designing theirs. I came across the [website of Mattia Tezzele](http://mrzool.cc/tex-boilerplates/), who made LaTeX boilerplates for some of those scenarios in which more intricate layout is required, namely for letters, resumes, and invoices. I have seen more similar boilerplates, but these are silky smooth and easily the cleanest I have seen. Most importantly, they fit perfectly with my current workflow. Writing is done in Markdown, and the bits that require special formatting are read in using a YAML header, which is exactly the method I also currently use for these blogposts. On top of all that, everything is well documented, and in case someone is unfamiliar with any of the parts of this workflow, resources for further reading are also provided. Did I mention everything is open source and for free?

Here's a snap of me writing this post: 

![](/images/10-blog/screen.png)

Let's give it a try. Mattia Tezzele provided a template markdown file for the first letter. Filling in the fields of sender and addressee are straightforward. Personally I only had to change one aspect of the template to make it compile. The boilerplate uses the `fontspec` LaTeX package to select fonts from your own system. In the template 'Courier' was for example mentioned as one of the fonts, but for my specific system (Arch Linux) that naming was not accepted. On top of that, I also don't think I had any of the default fonts installed on my system. I decided to keep it simple and choose a font from the large database of freely available [Google fonts](https://fonts.google.com/). 

Since the `fontspec` package uses system native fonts, I only needed to find the correct name of the font I wanted in my system. Fonts are saved in `/usr/share/fonts`. We could keep it relatively simple and look for fonts in the `TTF` folder, which contains a human readable list of fonts. Even simpler is to look for fonts on the Google fonts website, but it might occur that after a long search you pick a nice font you did not install on your system after all. I wanted to keep my letter style retro, so I picked the Inconsolata font (which I then also decided to use for this blog). Now all we need to do is find out under which name this font is known in the system. To find out, I ran:

```[Bash] 
fc-list | grep Inconsolata

/usr/share/fonts/TTF/Inconsolata-Bold.ttf: Inconsolata:style=Bold

/usr/share/fonts/TTF/Inconsolata-Regular.ttf: Inconsolata:style=Regular
```

As a font, I then included `Inconsolata:style=Regular` in the YAML header of my letter, as you can see in the screenshot above. Another minor issue is that my system complained about 'English' not being a valid language choice, so I changed it to `en-US`. The last thing you want to do for sure is make a pdf of your very own digital signature. I do not have hardware to draw on the pc, so instead I took a scan of my signature from my phone and edited it until it looked decent. I will show an example letter, but for privacy reasons I'll skip on using my own signature and instead will use the one provided with the example fictional letter from github, which is of Nietzsche. To match the signature, I wrote a fictional letter of our good old friend Friedrich:

[Click Me For A Cool Letter](/images/10-blog/Nietzsche_Letter.pdf)

For fast compiling using pandoc, you can use the makefile included with the download of the boilerplate. I instead made two quick bash scripts, one for creating a new letter (using a fresh copy of the letter template we by now customized to our needs and wishes), and another script to call pandoc to create a nice looking pdf.

For drafting a new letter (note that I saved my template in a folder called LetterTemplate):

```[Bash]
#!/bin/bash

# Copy the template to start a new letter

filename=$(date +%y-%m-%d_new.md)
echo $filename
cp -n LetterTemplate/lettertemplate.md $filename
```

And for writing it as a pdf to a folder called 'output':

```[Bash]
#!/bin/bash

# Write the markdown letter to pdf using pandoc and xelatex

if [ -f "$1" ]; then
    file=$(basename "$1$")
    filename=${file%.*}
    pandoc "$1" -s -o ./output/"$filename".pdf --template=letter.tex --pdf-engine=xelatex
fi
```

One last note: notice that when calling pandoc you need to place the correct boilerplate (here called 'letter.tex') in the templates folder at `~/.pandoc/`, and that this boilerplate only works with the 'xelatex' pdf-engine due to the `fontspec` package.

Have fun writing!


