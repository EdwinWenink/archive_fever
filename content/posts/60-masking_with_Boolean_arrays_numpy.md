---
title: Masking with Boolean arrays in Numpy
date: 2021-11-15T12:01:10+02:00
author: "Edwin Wenink"
tags: ["programming",'python','numpy']
series: ['Programming']
---

## Use case

I regularly encounter situations where I have an array that specifies which elements to keep in another array.
If you for example want to provide batched inputs to a BERT language model as a tensor, you have to pad the input text sequences because the tensor needs to be a square matrix.
BERT uses *attention masks* (Boolean arrays) to indicate which elements correspond to actual input tokens and which ones are special tokens such as meaningless padding tokens `[PAD]`.
If I use BERT to classify input tokens, I don't care about classifications on the `[PAD]` token, so I want to filter them out using the attention mask.

Numpy is very convenient for this use case, because it supports using boolean arrays directly as masks.
But before we dive into masking with boolean arrays, let's briefly discuss Numpy masked arrays.

## Masked arrays

Something that throws me off sometimes is that Numpy has a [masked array](https://numpy.org/doc/stable/reference/maskedarray.generic.html) class, but this has a slightly different and specific use case, namely to work with "arrays that may have missing or invalid entries".
The purpose of this is to be able to use the input array *as is*, but exclude the invalid elements from common computations.
A simple example from the [documentation](https://numpy.org/doc/stable/reference/maskedarray.generic.html):

```
>>> import numpy as np
>>> import numpy.ma as ma
>>> x = np.array([1, 2, 3, -1, 5])
>>> mx = ma.masked_array(x, mask=[0, 0, 0, 1, 0])
>>> mx.mean()
2.75
```

In this case the `1` in the mask indicates that the fourth data point is *invalid* (which to me is slightly counter-intuitive because in the example use case above I want to *keep* the entries with a `1`).
The benefit of the masked array module is that you don't have to modify the shape of the input array, but in my use case I actually just want to throw away the data I don't care about.
This is not desirable in cases where you do tensor computations and where the shape of the input must be preserved.

## Four methods

So in our use case we have two arrays, where the second serves as a mask that indicates which elements to keep in the first array.
We can use:

1. use `numpy.nonzero()` for creating a boolean array
2. explicitly cast the masking array as a boolean array
3. create a boolean array based on a logical condition
4. `numpy.where()`

```
arr = np.array([1,2,3])
mask = np.array([0,1,0])
```

Method 1. We essentially want to keep all elements from `arr` in the corresponding places where `mask` is non-zero:

```
>>> arr[np.nonzero(mask)]
array([2])
```

Python interprets `False` as `0` and `True` as `1`.
E.g. you can do arithmetic on booleans like:

```
>>> arr > 1
array([False,  True,  True])
>>> np.sum(arr > 1)
2
```

This means `nonzero()` can be used to mask an array using arbitrary conditions:

```
>>> arr[ np.nonzero(arr>1)]
array([2, 3])
```

This could be handy if you instead want to select elements of `arr` based on some threshold.
Although of course, you don't really need to bother with this because you can apply the mask directly:

```
>> arr[arr>1]
array([2, 3])
```

Method 2. The same can be achieved with by explicitly casting the mask to a Boolean array:

```
>>> arr[mask.astype(bool)]
array([2])
```

Method 3. But the most straightforward usage to me is creating the Boolean array based on a logical operator.
Numpy also nicely handles these operations by applying them to each array element:

```
>>> arr[mask != 0]
array([2])
```

Method 4. If you use `numpy.where` with a boolean condition, it is equivalent to using ` numpy.nonzero()`:

```
>>> arr[np.where(mask > 0)]
array([2])
```

The behavior of `numpy.where()` is more general because it allows you to pick an element for array-like `x` or `y` depending on a Boolean array, where an element from `x` is picked when the condition is `True`, and `y` otherwise.
This could simulate a bit of the behavior of the `numpy.maskedarray` class.
E.g. you use the masking array to keep only certain values and set others to `NaN` and then use `numpy` functions that ignore `NaN` values:

```
>>> np.where(mask > 0, arr, np.nan)
array([nan,  2., nan])
>>> np.mean(arr_nan)  # This will not give correct results
nan
>>> np.nanmean(arr_nan)  # But this a succesfull operation on the masked array
2.0
```

Note that the `numpy.where` function expects array-like arguments, but will automatically broadcast the value `np.nan` to an array of the correct shape.


## Multi-dimensional case

```
>>> arr = np.array([ [1,2,3], [4,5,6] ])
>>> arr
array([[1, 2, 3],
       [4, 5, 6]])
>>> mask = np.array( [[0, 1, 0], [1, 1, 0]])
>>> mask
array([[0, 1, 0],
       [1, 1, 0]])
```

If you apply the masking strategies 1-3 from above, it is good to know that the shape of the input array is not preserved, like with `numpy.ma`.
Instead you end up with a list of the preserved elements.

```
>>> arr[np.nonzero(mask)]
array([2, 4, 5])
```

If you want to preserve the shape of the input array, you can use `numpy.where`:

```
>>> np.where(mask > 0, arr, np.nan)
array([[nan,  2., nan],
       [ 4.,  5., nan]])
```

You can also provide a unidimensional mask to a multidimensional input array.
For example, in the token classification task mentioned above, BERT will output activations or probabilities over classes for each input token. 
Each input sequence thus gives an output with shape `(n_tokens, n_classes)`.
If you do batch processing, many of these tokens will be `[PAD]`, i.e. we want to mask on the first "token" dimension.
The attention mask in this case will have shape `(n_tokens,)`.
Let's say we have a short sentence with only two tokens, for which we predict fictitious activations over three output classes.
The first token is actual text, the second token is padding.
We can remove the padding tokens as follows: 

```
>>> a = np.array( [ [2,3,4], [5,6,7] ] )
>>> a.shape
(2, 3)
>>> m = np.array( [1,0] )
>>> m.shape
(2,)
>>> a[np.nonzero(m)]
array([[2, 3, 4]])
```

## Understanding the output of nonzero

The output of `np.nonzero` can be a bit hard to read because it's not organized by row indexes, but by dimension:

```
>>> np.nonzero(mask)
(array([0, 1, 1], dtype=int64), array([1, 0, 1], dtype=int64))
```

These two arrays have length three because we have three non-zero elements.
The row index of these three points are [0,1,1] and the column indexes are [1,0,1], which selects the following coordinates:

```
>>> np.transpose(np.nonzero(mask))
array([[0, 1],
       [1, 0],
       [1, 1]], dtype=int64)
```

Which is (by definition) the output of `np.argwhere`:

```
>>> np.argwhere(mask)
array([[0, 1],
       [1, 0],
       [1, 1]], dtype=int64)
```

However, you can't use this as index (which goes dimension-wise) so shouldn't be used for masking purposes.
