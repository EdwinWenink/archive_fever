---
title: "Applying operations on grouped dataframes in Pandas"
date: 2022-01-04T13:41:17+01:00
draft: false
author: "Edwin Wenink"
tags: ['programming', 'pandas']
series: ['programming']
---

I have the following use case:
I have legal text data that is stored on section level, so a single document with multiple sections will provide multiple rows to the data set.
These sections have a particular type.
For example, a case is typically concluded with a section where the judges offer their final ruling.

I want to investigate the hypothesis that each case has indeed a single section of the type 'decision'.

A dummy dataframe for this situation looks may like this:

```
import pandas as pd

data = {'doc_id': [1, 1, 2, 2, 3, 3],
        'section_id': [1, 2, 1, 2, 1, 2],
        'type': ['other', 'decision', 'other', 'other', 'decision', 'decision']}
df = pd.DataFrame(data)
```

This gives:

```
>>> df
   doc_id  section_id      type
0       1           1     other
1       1           2  decision
2       2           1     other
3       2           2     other
4       3           1  decision
5       3           2  decision
```

This dummy example distinguishes three cases: 

1. the first document contains a single section with a decision, as expected
2. the second document contains no section with a decision
3. the third document contains two sections with a decision

Notice that in this case we cannot simply test our hypothesis by counting the amount of documents and checking equality with the number of sections with type 'decision':

```
>>> len(df['doc_id'].unique())
3
>>> len(df.loc[df['type'] == 'decision'])
3
```

The totals add up, but our hypothesis is clearly false!

Instead, we want to test our hypothesis on the level of documents, not sections, so we *group* our data by the document identifier:

```
>>> df.groupby('doc_id')
<pandas.core.groupby.generic.DataFrameGroupBy object at 0x000001C55EF8F9E8>
```

Now we want to count the number of 'decision' sections on the data that is grouped *per document*, so we want to *apply* the counting operation on the grouped data.
For this I apply a lambda expression in order to only regard data from the 'type' column of each group.
With this functional style, we can do all operations in a single line:

```
>>> decision_counts = df.groupby('doc_id').apply(lambda x: len(x.loc[x['type'] == 'decision']))
>>> decision_counts
doc_id
1    1
2    0
3    2
```

We end up with a dataframe that lists the number of 'decision' sections per document.
Counting how many documents violate our hypothesis is now trivial.
We can count the number of documents that have no 'decision' sections and those that have more than one, as follows:

```
>>> decision_counts[decision_counts == 0]
doc_id
2    0
>>> decision_counts[decision_counts > 1]
doc_id
3    2
```

We indeed see that document 2 has zero 'decision' sections, whereas document 3 has two.
