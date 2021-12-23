---
title: "Zip is its own inverse"
date: 2021-12-23T16:03:24+01:00
draft: false
author: "Edwin Wenink"
series: 'programming'
tags: ['programming', 'python']
---

You can undo the zipping operation using `zip` itself.
Let's explore that in Python.
By using the unpacking operator `*` you don't have to manually specify the number of arguments (although I do assume the return of two components in the example below).
In Python 3, the zip operator returns a generator instead of a list, so you need to explicitly cast to a list if you want one.

```
>>> a = [1, 3]
>>> b = [2, 4]
>>> c = list(zip(a,b))
>>> c
[(1, 2), (3, 4)]
>>> a, b = list(zip(*c))
>>> a
(1, 3)
>>> b
(2, 4)
```

The inverse operation will always return tuples in Python, so if your original input was a list, you also need to convert back the results to a list. 

This operation is super handy.
For example, I wrote a class to recommend relevant texts for a query document based on their distance in a vector space.
The `recommend()` function of this class returns a list of recommended texts and a list of tuples containing relevant metadata about those texts.
So the metadata will be a list of `(distance, document_id, type)` tuples.
We may be interested in easily retrieving all distances, document_ids etc. as a list of their own.
We can do that by using the unpack+zip trick:

```
distances, document_ids, types = zip(*meta)
```


