---
title: "On Bayesian likelihood"
date: 2020-09-01T12:12:39+02:00
draft: false
tags: [Bayes, probability, MLE, MAP]
author: Edwin Wenink
tex: true
---

<small>15/10/2020 Extended with an explanation of MAP; minor fixes and changed the title</small>

Take Bob. 
Bob is not feeling so great and has a runny nose.
This is an observation that may depend on various other conditions.
Perhaps Bob has a cold, perhaps he has allergies, or perhaps he unfortunately picked up COVID-19.
Given that we know Bob has a runny nose, which one of these potential explanations is more likely (assuming for the sake of simplicity that these are the three options)? 

Bayes' theorem allows us to formulate an answer to that question.
Let `R=True` stand for the observation that Bob has a runny nose, and let `H` be the variable indicating the three hypotheses.
Then Bayes' theorem looks as follows:

$$P(H|R)=\frac{P(R|H) \times P(H)}{P(R)}$$

Where e.g. `P(H=cold|R=True)` should be read as "the probability that Bob has a cold, given that we know he has a runny nose".
Our confidence in each of the three hypotheses depends on several factors.

To start with, it depends on how likely that hypothesis is in the first place.
For example, even during the current pandemic, if you look at the whole population it is still more likely you have a regular cold than COVID-19.
This is called the "prior" probability of the hypothesis.
Our confidence in the hypotheses also depends on the conditional probability `P(R|H)`, which answers questions like: "Assuming I have COVID-19, how likely is it then that I develop a runny nose?"
This probability is commonly called the "likelihood" of the hypotheses.
Finally, Bayes' theorem normalizes the whole bunch into a proper probability by taking into account the "marginal" probability of someone (a random individual from the overall population) developing a runny nose.
Bringing it all together, Bob is for example more likely to have a regular cold than COVID-19, if 1) a cold occurs more commonly across the population and 2) almost all people who have a cold have a runny nose (i.e. a cold would be a good "explanation" of the symptoms).

In this terminology we can informally rewrite Bayes' theorem as:

$$posterior\ probability = \frac{likelihood \times prior}{marginal\ probability}$$

The resulting probability of Bayes' theorem is usually called the "posterior" probability, because it expresses how much our "prior" confidence in `H={h1, h2, h3}` has changed *after* we learn that Bob has a runny nose.
Of course, these probabilities change again once Bob takes a test for either of these ailments.
And even if Bob takes a test, Bayes' theorem allows us to take into account the probabilities of false positives and negatives.

In short, Bayes' theorem is pretty awesome because it can be used to express how the probability of one event depends on related possible events. 
The application of Bayes' theorem is not necessarily Bayesian though.
If you are a typical Bayesian, you would also interpret the involved probabilities as "credences" or "degrees of belief", and then apply the process of *conditionalization* (the diachronic application of Bayes' theorem over an "old" and "new" moment in time) in order to express how our (subjective) beliefs change when we learn new information. 

Now, there's one term in Bayes' theorem that caused some confusion when I first considered it more closely.
That's the so-called "likelihood" `P(R|H)`.
Bayes' theorem is derived from the definition of conditional probability. 
As a conditional probability, we would for example read `P(R=True|H=Covid)` as follows: "How likely is it that Bob has a runny nose, assuming he has COVID-19".
In that case, we talk of the likelihood of the *data*, in this case the observed symptom of Bob. 
In the literature however, `P(R=True|H=Covid)` is also sometimes called the likelihood *of the hypothesis*.

Personally I found it helpful to have a look at the terminology of *maximum likelihood estimation*.
In this case our "hypotheses" are parameters for some parametric model that we are using to describe our data.
We are then trying to the find the parameters such that this model *best* describes the data (cf. finding the best hypothesis).
I'll get technical for one minute and then recap in more understandable language.

Assume we have a parametric model with parameters $\theta$, e.g. a probability density function $p_{theta}(x)$.
Then the *likelihood* of this parametric model can be written as $$L(\theta|X) = \prod_{x \in X} p_{\theta}(x)$$
As an aside, we usually take the log-likelihood $l(\theta|X) = log \prod_{x \in X} p_{\theta}(x)$[^1]. 

[^1]: The logarithm over a product is the sum over the component's logs, i.e. $log \prod_{x \in X} p_{\theta}(x) = \sum_{x \in X} log p_{\theta}(x)$.
The logarithmic function is "monotonically increasing", which guarantees that the parameter  that will maximize the log-likelihood will also maximize the regular likelihood.
A sum is easier to work with and this way we also avoid numerical underflow due to the joint probabilities becoming extremely small.

What we are doing with maximum likelihood estimation is finding the best parametric model given the observed data, which means that we want to choose the parameters of our model such that the data is most likely under the assumptions of this parametrized model.
This is, by definition, the task of finding the maximum likelihood:

$$ \hat{\theta} = \underset{\theta}{argmax\ }l(\theta|X)$$

where $\hat{\theta}$ is known as the *maximum likelihood estimate* (MLE).
In other words, the MLE is the parameter (cf. "hypothesis)" for which the data is most likely.
Since this would be the "best" or "most likely" model, we understand the likelihood of our hypotheses in terms of how probable it is that we observed out data, assuming the hypothesis were true. 
So in plain language: a good hypothesis for some model assigns a high probability to the observed data.

The Bayesian approach differs from standard maximum likelihood estimation in that it does not straightforwardly assume there is a "true" parameter $\theta$. 
Instead, we allow uncertainty over our parameters and incorporate this by defining a prior distribution over $\theta$.
When taking into account our prior beliefs, the matter of finding the most likely parameter/hypothesis is then to find the *posterior* distribution.
This is the so-called Bayesian MAP problem, namely finding the *maximum a posteriori probability*.
When we write out the probability of our parameters/hypotheses in terms of Bayes' rule, we get:

$$p(\theta|X) = \frac{ p(X|\theta)q(\theta) }{ \int_{\theta \in \Theta} p(X|\theta)q(\theta) d\theta  }$$

Where $q(\theta)$ is the distribution of our prior beliefs over the possible parameters.
The above formula assumes that $\theta$ is continuous, but this is not important for now. 

MAP is then defined as finding the most likely parameter, so $\underset{\theta}{argmax\ } p(\theta|X)$.
Because everything in the denominator is only for normalization and does not depend on our current hypothesis, we can ignore it in the maximization operation.
So we get  $\underset{\theta}{argmax\ } p(\theta|X)= \underset{\theta}{argmax }\ p(X|\theta)q(\theta)$.
So *again* we see that finding the most likely parameter/hypothesis is a matter of finding the parameters that makes the data most likely (but now also taking into account the prior credence of the hypothesis itself).
If we have equal prior belief in all our hypothesis, this is the same as maximum likelihood estimation.

So when `P(R=True|H=cold)` was called the likelihood of the hypothesis `H=cold`, this is because that hypothesis assigns a very high probability to the symptom of a runny nose and is thus a likely "explanation" of that symptom (where we understand explanation bare bones in terms of probability).

I still think this way of talking can be slightly confusing and it seems to ignore the prior.
But the bottom line is that a hypothesis is more likely when it makes the data, that we *observed* and *know* to be the case, more likely.
