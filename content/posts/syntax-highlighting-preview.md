---
title: "Syntax Highlighting Preview"
date: 2017-12-20T12:33:21+08:00
tags: ["example","code","highlight.js"]
draft: true
---

Syntax highlighting is a feature of text editors that are used for programming, scripting, or markup languages, such as HTML. Besides Chroma, the default syntax hightlighter in Hugo, [highlight.js](https://highlightjs.org/) is a better choice. The bare minimum for using highlight.js on a web page is linking to the library along with one of the styles and calling initHighlightingOnLoad:

```
<link rel="stylesheet" href="/path/to/styles/default.css">
<script src="/path/to/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

Theme one uses the github style color theme. 

CSS

```css
@font-face {
  font-family: Chunkfive; src: url('Chunkfive.otf');
}

body, .usertext {
  color: #F0F0F0; background: #600;
  font-family: Chunkfive, sans;
}

@import url(print.css);
@media print {
  a[href^=http]::after {
    content: attr(href)
  }
}
```

JavaScript

```javascript
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}

export  $initHighlight;
```

Python

```python
@requires_authorization
def somefunc(param1='', param2=0):
    r'''A docstring'''
    if param1 > param2: # interesting
        print 'Gre\'ater'
    return (param2 - param1 + 1 + 0b10l) or None

class SomeClass:
    pass

>>> message = '''interpreter
... prompt'''
```

Shell Session

```shell
$ echo $EDITOR
vim
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
$ git push
Everything up-to-date
$ echo 'All
> done!'
All
done!
```

You can download a custom bundle from [here](https://highlightjs.org/download/) including only the languages you need.

