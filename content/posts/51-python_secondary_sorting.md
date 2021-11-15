---
title: "Secondary sorting in Python"
date: 2020-07-29T22:17:39+02:00
draft: false
author: Edwin Wenink
tags: [python, coding, programming]
series: 'Programming'
---

Let's say we want to compute the mode of a series of numbers, meaning that we pick the value that occurs most. 
This is easy enough: we sort on the amount of occurrences, assuming we have some datatype that tracks the amount of occurrences per value.
However, we need to deal with the edge case of two values occurring the same amount of times. 
In other words, after having sorted on occurrences, we need to sort on the value to break the tie.

If we pick the largest value, both the primary and the secondary sorting use the same sorting order.
Python's `sorted` and `sort` (the in-place variant) accept tuples as sorting keys, so that you can straightforwardly perform the secondary sorting in one line. 
First, we get (value, count) tuples:

```python
from collections import Counter

values = [1, 2, 2, 5, 5, 7, 10]
counter = Counter(values)
counts = counter.items()
```

`counts` looks like this:

```python
dict_items([(1, 1), (2, 2), (5, 2), (7, 1), (10, 1)])
```

To reiterate, we want the numbers with the largest count first (2 in this case) and then either pick the smallest or the largest number as a tie breaker.
We start by picking the largest value, for the sake of argument.
For each tuple `x`, which looks like (value, count), we first sort on the count ( `x[1]`) and then on the value (`x[0]`).
We can provide these sorting keys as a tuple.
Because we want the biggest counts (primary) and biggest values (secondary) in the beginning of the list, we use a *descending* sorting order with `reverse=True`.

```python
values_by_count = sorted(counts, reverse=True, key=lambda x: (x[1], x[0]))
```

This outputs: 

```python
[(5, 2), (2, 2), (10, 1), (7, 1), (1, 1)] 
```

We see that the tuples with the highest counts are in the beginning of the list, and that for the ties with count 2, the highest value (5>2) is listed first.

But what if we want to have the biggest counts first (descending sorting order), while instead picking the *smallest* value in case of a tie (ascending sorting order)?
The handy one liner above assumes that we use the same sorting order for both the primary and secondary key!

So how can we maintain this ease of syntax while using different sorting orders?

Because we work with numerical data, we can use a little hack. 
We can call `sorted` using the default *ascending* sort order, but nevertheless sort on the counts in a *descending* fashion by sorting on the negative of the counts. 
So we write:

```python
sorted_counts = sorted(counts, key=lambda x: (-x[1], x[0]))
mode = int(sorted_counts[0][0])
```

Whereas in the former example the outcome was 5, the outcome now is 2.
If you do not have numerical data (e.g. counts), you would have to make multiple sorting calls.
