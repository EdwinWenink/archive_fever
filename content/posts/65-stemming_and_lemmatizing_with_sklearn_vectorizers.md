---
title: "Stemming and lemmatizing with sklearn vectorizers"
date: 2022-01-21T19:21:21+01:00
draft: false
author: "Edwin Wenink"
series: 'programming'
tags: ['programming', 'sklearn', 'NLP']
tex: true
---

One of the most basic techniques in Natural Language Processing [(NLP)](zettelkasten/index_NLP_Natural_Language_Processing.md) is the creation of feature vectors based on word counts.

`scikit-learn` provides efficient classes for this:

```
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
```

If we want to build feature vectors over a vocabulary of *stemmed* or *lemmatized* words, how can we do this and still benefit from the ease and efficiency of using these `sklearn` classes?

## Vectorizers: the basic use case

Conceptually, these vectorizers first build up the vocabulary of your whole text corpus.
The size of the vocabulary determines the length of the feature vectors, unless you specify a maximum amount of features (which you probably should, cf. [Zipfs law](zettelkasten/202009151217-Zipfs_law.md)).
The vectorizers check for each document how often a certain word (or n-gram, technically) occurs in that document.
The `CountVectorizer` only takes the term frequency (TF) into account.
However, words that occur in almost all the documents (like stop words) are not very useful for characterizing individual documents and distinguishing them from others.

> We should treat matches on non-frequent terms as more valuable than ones on frequent terms, without disregarding the latter altogether. The natural solution is to correlate a term's matching value with its collection frequency. (Karen Spärk Jones, 1972)

The `TfidfVectorizer` therefore additionally weighs the word frequency with how common the word is in the whole corpus.
If a word occurs a lot in document $t$ but is quite rare throughout the whole corpus, then this is a useful word to characterize the current document.
Conversely, if a term is frequent in document $t$ but it occurs a lot in literally every other document as well, then it is a poor descriptor.
In its most basic form (without smoothing etc.) [TF\*IDF scoring](zettelkasten/202201211817-TF_IDF.md) looks like this:

$$TF(t,d) * log (\frac{N}{DF(t)})$$

Where $TF(t,d)$ is the frequency of term $t$ in document $d$, $N$ is the total amount of documents in the corpus, and $DF(t)$ is the amount of documents in which term $t$ occurs.
The logarithm is called the Inverse Document Frequency (IDF), hence we get TF\*IDF.
The logarithm prevents that very rare words completely dominate the score.
Additionally, it punishes the most frequent words relatively heavy.

## Composing a new tokenizer

It is very convenient and efficient to use the `sklearn` vectorizers, but how can we use them when we want to do additional natural language processing during the building of the corpus vocabulary?

Vectorizers can be customised with three arguments: 1) preprocessor, 2) tokenizer, and 3) analyzer:

1) The preprocessor is a callable that operates on a whole string and returns a whole string.
2) The tokenizer takes the preprocessor output and returns a list of tokens.
3) The analyzer is a callable that replaces the whole pipeline, including preprocessing and tokenization, and I think also including N-gram extraction and stop word filtering.

So in order to add stemming or lemmatization to the sklearn vectorizers, a good approach is to include this in a custom tokenize function.
This does assume our stemming and lemmatization functions only need access to tokens, instead of the whole input strings (may be documents, sections, paragraphs, sentences etc.).

This is a very nice snippet to compose functions using `functools` 

```python
import functools

def compose(*functions):
    '''
    Compose an arbitary amount of functions into a single function
    Source: https://mathieularose.com/function-composition-in-python
    '''
    def comp(f, g):
        return lambda x: f(g(x))
    return functools.reduce(comp, functions, lambda x: x)
```

Assuming we have some class where we can assign a stemmer, a lemmatizer, or neither, we can override the tokenizer as follows:

```python
# If a stemmer or lemmatizer is provided in the configuration
# compose a new tokenization function that includes stemming/lemmatization after tokenization.
# This allows stemming or lemmatization to be integrated e.g. with CountVectorizer
if stemmer: 
    self._tokenize = compose(self._stemmer.stem, self._tokenizer.tokenize)
elif lemmatizer:
    self._tokenize = compose(self._lemmatizer.lemmatize, self._tokenizer.tokenize)
else:
    self._tokenize = self._tokenizer.tokenize
```

Note that the order of the composition matters, because the function signatures differ.
A tokenization function takes a string as an input and outputs a list of tokens, and our stemming or lemmatization function then operates on this list of tokens.
We can now define a `TfidfVectorizer` with our custom callable!

```python
ngram_range = (1,1)
max_features = 1000
use_idf = True

tfidf = TfidfVectorizer(tokenizer=self._tokenize,
                        max_features=max_features,
                        ngram_range=ngram_range,
                        min_df=1, 
                        max_df=1.0,
                        use_idf=use_idf)
```

The vocabulary will now consist of stems and lemmas.
