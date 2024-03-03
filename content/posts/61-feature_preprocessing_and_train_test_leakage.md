---
title: "Wrong feature preprocessing is a source of train-test leakage"
date: 2021-12-10T12:39:02+01:00
draft: false
author: "Edwin Wenink"
tags: ['machine learning', 'python','programming']
series: 'Machine learning'
---

Feature selection should be done *after* train-test splitting to avoid leaking information from the test set into the training pipeline.
This also means that feature selection should be done *within* each fold of cross-validation, not before.
This sounds obvious, but this is something that goes wrong easily and often.
Especially when the feature extraction and selection pipeline is relatively expensive, having to repeat it in each fold may be a perverse incentive to want to only do it once before cross-validation.
It may also be that feature selection is done on the data set prior to even starting other machine learning work, so it's easy to overlook.
In this post we discuss the do's and don'ts when it comes to leaking information from a test set during preprocessing.

## Code example

This is an example of how it should *not* be done ([source](https://stackoverflow.com/questions/56308116/should-feature-selection-be-done-before-train-test-split-or-after)):

```python
import numpy as np
from sklearn.feature_selection import SelectKBest
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# random data:
X = np.random.randn(500, 10000)
y = np.random.choice(2, size=500)

selector = SelectKBest(k=25)
# first select features
X_selected = selector.fit_transform(X,y)
# then split
X_selected_train, X_selected_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.25, random_state=42)

# fit a simple logistic regression
lr = LogisticRegression()
lr.fit(X_selected_train,y_train)

# predict on the test set and get the test accuracy:
y_pred = lr.predict(X_selected_test)
accuracy_score(y_test, y_pred)
# 0.76000000000000001
```

In this example, we expect a performance around 0.5 because our data and target labels are randomly sampled.
Nevertheless, we find that we have a significantly better performance *even though there is no interesting signal in the data*, because our feature selection is biased towards information of (what will be) the test set.
You can see that the feature selector is fitted using target signal `y`, which includes samples that will later be in the test set.

Instead, you should only fit the data preprocessing steps on the training data *after* splitting, and then at inference time *apply* (but not refit!) the preprocessing steps:

```python
# split first
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
# then select features using the training set only
selector = SelectKBest(k=25)
X_train_selected = selector.fit_transform(X_train,y_train)

# fit again a simple logistic regression
lr.fit(X_train_selected,y_train)

# select the same features on the test set, predict, and get the test accuracy:
X_test_selected = selector.transform(X_test)
y_pred = lr.predict(X_test_selected)
accuracy_score(y_test, y_pred)
# 0.52800000000000002
```

This now gives the expected performance!
Because there is no useful signal in the training labels, this machine learning classifier is effectively making random guesses for this binary classification problem.

## Unsupervised feature selection as exception

There is a single exception to above procedure.
Unsupervised feature selection procedures do not use the target signal and thus also do not have the same biasing effect towards the test set.
So you may for example remove features that always have the same value, i.e. selection based on (zero) variance.

Okay, well, let's test that!

```python
from sklearn.feature_selection import VarianceThreshold

selector = VarianceThreshold(threshold=1)  # Normally you'd do some form of scaling
# first select features
X_selected = selector.fit_transform(X)  # y is not used here
# then split
X_selected_train, X_selected_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.25, random_state=42)
print(X.shape, X_selected.shape)

# fit a simple logistic regression
lr = LogisticRegression()
lr.fit(X_selected_train,y_train)

# predict on the test set and get the test accuracy:
y_pred = lr.predict(X_selected_test)
accuracy_score(y_test, y_pred)
# 0.512
```

Which is again close to the baseline, as expected!

## Let the exception be just that: an exception

In this dummy example we know that the values of each feature follow the same distribution, since we generated them by sampling from it.
In practice, it may be that some features have a very different scale, which makes selection using a single variance threshold insensible because the variance is dependent on the chosen scale.
If I change a measurement in meters into centimeters, the same data will suddenly have a larger variance!
This is why you would scale your data e.g. using a `MinMaxScaler` using a variance threshold ("standard scaling" to zero mean and unit variance is in this case useless because, well... the variance will always be 1).

If you apply this form of feature scaling before splitting the data, you'll use *global* data statistics, in this case the global minimum and maximum per feature.
However subtle, this is also a form of leakage from the test set into the training pipeline which may lead you to either over- or underestimate your model performance.
A preprocessing step would not leak information if it only requires information from a single sample, i.e. a "row" in the data array.
Scaling instead uses the whole "column" corresponding to feature values.
By scaling features using statistics from the test set as well, you basically do not account for the fact that the data distribution of your test data may be different.
You therefore effectively do not as adequately evaluate the ability of the model to *generalize* to unseen data.

In short, even though unsupervised feature selection does not leak data strictly by itself, this insight is not super useful in practical applications because 1) you'll likely also need other prior steps that *do* leak information and 2) you'll have to constantly be careful and overthink each each step, which costs effort while unnecessarily being at risk.

It's better to just follow the rule of thumb:
avoid leakage by always fitting your data preprocessing and feature selection *only* on the *training* data.
During testing, only *apply* the data preprocessing steps used during the training phase.

Useful sources:

- https://www.nodalpoint.com/not-perform-feature-selection/
- https://stackoverflow.com/questions/56308116/should-feature-selection-be-done-before-train-test-split-or-after
- https://machinelearningmastery.com/data-preparation-without-data-leakage/
