---
title: "Initializing nested lists correctly"
date: 2022-07-27T11:16:50+02:00
draft: false
author: "Edwin Wenink"
series: 'programming'
tags: ['programming', 'python']
---

If you want to initialize a list with a certain size in Python, you can use the following clean syntax:

```
>>> arr = [None]*3
>>> arr
[None, None, None]
```

We can then fill the list with elements:

```
>>> arr[1] = 1
>>> arr
[None, 1, None]
```

But watch what happens when we try to use the same syntax for declaring a 2D dynamic array:

```
>>> arr2 = [[]]*3
>>> arr2
[[], [], []]
>>> arr2[1].append(1)
>>> arr2
[[1], [1], [1]]
```

The desired result here was the ragged array `[[], [1], []]`, but instead we accidentally filled *all* nested lists...
What happened?!
Well, we observe here that the `*` operator creates a list where the elements reference the same underlying object!

```
>>> id(arr2[0])
1474142748360
>>> id(arr2[1])
1474142748360
>>> id(arr2[2])
1474142748360
```

So that explains why adjusting one sublist affects all sublists: they are the same object.
But why did we then not have the same issue when initializing the flat empty list with None objects?
Actually, the `*` operator works exactly the same here and *also* creates a reference to the same object.

```
>>> id(arr[0])
140720689536224
>>> id(arr[2])
140720689536224
```

But if we inspect the element where we filled in a value, we *do* see that it is a new object:

```
>>> id(arr[1])
140720690012576
```

The crucial difference is that this `NoneType` object is *immutable*.
The referenced object *cannot be changed* but is rather replaced with a new object.
The same reasoning holds when we have a list of integers or strings.
In case of a list of lists, or a list of dictionaries (any mutable data structure) however, we *can* adjust the referenced object and then the change will reflect onto all sublists.
Because something like `[1]*3` works as expected, it can be hard to spot the difference in behavior when working with nested mutable data structures.

If we explicitly replace a whole sublist with a new object, there's no issue:

```
>>> arr2[1] = [2]
>>> arr2
[[1], [2], [1]]
```

This is not a practical solution though, because we want to be able to use functions like `append()` on sublists correctly.
The general solution is to force Python to make a new object for each sublist, which means - however nice and clean the syntax looks - we have to avoid using `*` for this!
Instead, create the sublists in an explicit loop or for example a list comprehension:

```
>>> arr3 = [[] for _ in range(3)]
>>> arr3
[[], [], []]
>>> arr3[1].append(1)
>>> arr3
[[], [1], []]
```

This way each of the sublists is its own object, rather than being a reference to the same list, because we force Python to evaluate `[]` 3 times instead of only once. 
