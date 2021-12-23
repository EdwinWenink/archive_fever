---
title: "Flatten nested lists with a list comprehension"
date: 2021-12-23T16:03:12+01:00
draft: false
author: "Edwin Wenink"
series: 'programming'
tags: ['programming', 'python']
---

Here's my programming tip of the day.
You can flatten a nested list of lists into a single flat list with a nested list comprehension.
Wow, phrasing.

It's easy to get confused.
If you forget how to do it, you can first write out the whole loop:

```
# Flatten list
>>> flat = []
>>> nested = [ [1, 2, 3], [4, 5, 6] ]
>>> for sub in nested:
>>>    for element in sub:
>>>        flat.append(element)
>>> flat
[1, 2, 3, 4, 5, 6]
```

To collapse this into a one-liner, work from the *outer scope inwards*:

```
flat = [ el for sub in nested for el in sub ]
```

Voila. Lean and mean.
