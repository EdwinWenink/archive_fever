---
title: Vacancy Recommender Hackaton with Spark 
author: Edwin Wenink
date: 2019-05-17
tags: [Big Data, Spark, Programming, Hackaton, Recommender, Docker]
---

[BigData Republic](https://www.bigdatarepublic.nl/) organized a small hackathon for the Big Data course I currently follow at university.
The challenge was to build a job recommendation system using real data from one of their clients, RandStad, which is a big employment agency.
To my surprise, I ended up with the highest score and went home with a nice book as a prize. 
I was fully convinced that the score I achieved was very low, and I know for a fact that the road to victory had way less to do with intelligence than with strategic pragmatism. 
I will not share the Spark notebook itself, as the data we worked with is not open and much of the code was already provided by BigData Republic. 
Nevertheless I did gain some insights that I would like to share. 

### The challenge

Employment agencies such as RandStad want to show customers looking for a job the most relevant vacancies, given their preferences.
The challenge for this hackathon was to build a recommender system that predicts a top 15 of vacancies, that can be shown to the user.

### Data

All data was anonymized. 

- A dataset containing information about the behavior of clients in the webinterface of RandStad. It stores whether users opened a particular vacancy, started an application or finished a vacancy, alongside further information about that vacancy, such as how many hours per week it is, the wage per hour etc. 
- A dataset of user profiles storing user preferences, such as the desired wage, minimum and maximum working hours, and maximum travel distance. 
- A dataset of vacancies, of which we will make a selection for recommendation.

### Architecture of the solution 

The basic model used for recommendation is [Collaborative filtering using alternating least squares](https://spark.apache.org/docs/2.2.0/ml-collaborative-filtering.html). 

There are two basic ingredients for this type of recommendation systems:

1) We have some data of users using some items, e.g. buying products in a supermarket. We can represent this in a user-item matrix.
However, most users do not buy all items, and most items are not bought by all users, so this matrix is sparse, i.e. mostly filled with zero-entries.

2) We thus need some way to associate users with products they didn't buy yet so we can potentially recommend those products, based on the knowledge we already have of user preferences for particular products. 
In other words, zero-entries need to be filled in with a preference estimation.
The Collaborative Filtering with ALS technique does this through finding a factorization of the user-item matrix into two matrices with lower dimensions, that map users onto a number of latent factors (a "user profile"), and these latent factors back unto the items (an "item profile").
With ALS one tries to find two matrices that approximate the bigger input matrix when they are multiplied with each other.
Based on these smaller estimated matrices with latent factors, it is possible to re-compute the user-item association matrix, which now has 
preference scores for items that previously had zero-entries.

To implement this model in Spark, there are two major things to take into consideration:

#### Implicit versus explicit feedback

Preferences of users for particular products can be explicit, for example when you ask users to rate the products they buy on a scale from 1 to 10 in a questionnaire. 
However, one can also have an implicit measure of preferences.
If for example a particular customer very often buys cucumbers, we can infer from that that user has a preference for cucumbers, even though we do not have an explicit normalized rating of cucumbers. 

When it comes to Big Data, it is more likely that you have implicit preference data at your disposal. 
In the case of this hackathon, the indirect information we have of customer preference is a log of what vacancies users click on in the vacancy search machine of RandStad. 
If users click more on a particular type of vacancy, e.g. for management functions, we can infer this user prefers management functions, rather than for example being a cashier in a supermarket.

#### Cold-start problem

Another challenge for this setup is the so-called cold start problem. 
Computing an user-item association matrix for a given set of users and items is computationally quite expensive. 
But in the case of a big employment agency, new job vacancies come in continuously.
Unless you retrain the whole model, you then cannot recommend these new vacancies, which obviously is very undesirable.
At the same time, it is prohibitive to continuously redo all your work to include these vacancies in real-time.

The workaround suggested by the people from BigData Republic and used in this hackathon, is to not train the recommendation model on user-vacancy preferences, but instead on user-function preferences. 
This is a good solution because function titles are not as volatile as individual vacancy descriptions. 
In other words, if a new vacancy comes in, we already know the preference of a user for that function title, because the ALS model is trained on many other vacancies with the same function description.

We thus end up with a model like this (written in Scala):

```Java
 val als = new ALS()
  .setMaxIter(20)
  .setRegParam(0.001)
  .setRank(10)
  .setUserCol("candidate_number")
  .setItemCol("function_index")
  .setRatingCol("rating")
  .setImplicitPrefs(true)
val model = als.fit(grouped_train)
```

`grouped_train` is the data of user clicks where vacancies are grouped under their function name.

#### Recommending vacancies
But given that basic model, we have a recommendation score for functions, and not vacancies. 
If we take the top 3 preferred functions for a user, and then join all vacancies on these function descriptions, then we end up with a very large list of recommended vacancies for a user.

Therefore the rest of the work in the hackathon was to come up with a good way of selecting a top 15 in this long list of vacancies.
This is done by joining in profile data containing further user preferences such as the desired wage, working times, and maximum traveling distance.
Based on that information you can either filter out vacancies, or integrate these preferences in a final weighted recommendation score.

The end result of this whole process is a top 15 of vacancies to first display to the end user.

### Parameter optimization, weighing factors for a final prediction

Everyone used the same general approach with the ALS model, so what distinguished my solution from others where 1) model parameters and 2) further scoring and processing of vacancies based on profile data.

This is where the hackathon really started feeling "hacky" to me.

A major practical limitation was that I was running a Spark notebook on a real-life data problem, within docker, on an old ThinkPad with limited computing power and memory. 
This effectively resulted in the Spark notebook kernel dying on me regularly, so running the whole data pipeline even once was quite a hassle.
Using fancy techniques to search for optimal parameter settings where thus out of the question for me, and I had to resort to playing around with parameters manually.

Especially because running the whole process took a while, I really wanted to be smart about what parameter combinations I tried out. 
But the somewhat disappointing answer (not a bad answer though) I got from one of the BigData Republic people was that there were no very specific rules of thumb, for example for choosing the amount of latent factors in the ALS model. 
Normally, instead of having 12Gb of working memory, similar Spark code would be run on a cluster with 1TB of working memory... which allows automated search for the best parameter settings. 

From there on pragmatism took over. 
With respect to model parameters, the adagium "higher is better" did not hold for me, first of all because it made my pc crash, and secondly because the risk of overfitting on the training data became larger.
So w.r.t default ALS paramaters, I actually only *lowered* them: less iterations and less latent factors in the matrix factorization.

The largest improvement in my final score was achieved by using profile data and weighing various factors differently. 
We computed a score for whether the vacancy matched the preferred working hours or not, and a normalized score for how far away the job is from the candidate. These factors, together with the recommendation score for the function title of a particular vacancy, were weighed together to produce a final score per vacancy.
It turned out that people care a lot about how far the job is, and I gave this factor a very big weight of 10:1 compared to the recommendation score for the actual function title (but note that only vacancies for the top 3 function descriptions were taken into account, so the ALS model already fulfilled its purpose). 

### Result and reflection

The final score for the competition was a very simple recall measure, i.e. what percentage of the vacancies candidates actually applied for (can be extracted from the dataset of browsing behavior) was recommended *in the top 15* vacancies by the recommendation model. 
My final recall score on a test set was 16.8% (19.8% on the validation set).
A baseline performance of 2.9% for comparison was calculated by always predicting the 15 most popular vacancies.

I thought my score was pretty low (and I'm sure it is) so I was very surprised to win, but given that all competitors were beginners and faced similar hardware issues as I did, the playing field of recall scores was more or less between 13-17%.
People with more interesting ideas about parameter optimization where probably not successful in their efforts due to serious hardware limitations.
Perhaps people also put more effort in optimizing their ALS model, only to see it overfit on the training data and really drop in score on the test data.

The overall impression I am left with, is that "real" data science is extremely hard to do properly, and that for most people working in the data business, data science/engineering is mostly slapping together pre-existing models and making computers crunch a lot on optimizing them. 

The most intelligence is required for choosing the right methods for the problem at hand, and making smart design decisions on what information to exploit. But apart from that, I feel that the average attitude is: please don't ask too about the internals of the algorithms or the *meaning* of a parameter setting.

### Tools used

- Docker
- Spark
- Spark ML
- Spark Dataframes
- Spark SQL
- My poor old ThinkPad
