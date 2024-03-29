---
title: "Mnemonic for closed-form Bayesian univariate inference with Gaussians"
date: 2021-06-13T21:35:29+02:00
draft: false
tags: ['Gaussian', 'Bayes', 'probability', 'inference']
author: "Edwin Wenink"
tex: true
---

The following note helps me remember the closed-form solution for Bayesian inference using Gaussian distributions, which comes in handy very often.
See Bishop p.98 (2.141 and 2.142) for closed-form parameter updates for univariate Bayesian inference using a Gaussian likelihood with conjugate Gaussian prior.
Let's start with the rule for the posterior mean:

$$\mu_{new} = \frac{\sigma^2}{N \sigma_{0}^2 + \sigma^2} \mu_0 + \frac{N \sigma_{0}^2}{N \sigma_{0}^2 + \sigma^2} \mu_{MLE}$$

Where we know that the maximum likelihood estimate for the mean is the sample mean:

$$\mu_{MLE} = \frac{1}{N} \sum_{n=1}^N x_{n}$$

See the bottom of this post for a derivation of the maximum likelihood estimate for the mean.
Notice that the mean update has the following shape, balancing between the prior mean and the data sample mean:

$$\mu_{new} = \lambda \mu_{0} + (1-\lambda) \mu_{MLE}$$

With 

$$ \lambda = \frac{\sigma^2}{N \sigma_{0}^2 + \sigma^2}$$

I find this form a bit hard to remember by heart.
We can also think of this weighting factor $\lambda$ as the *prior precision* divided by the *posterior precision*.
This is not immediately obvious, but we can already see in the formula for $\mu_{new}$ that, as the posterior precision increases, the posterior density becomes more concentrated around the maximum likelihood solution for the mean, $\mu_{MLE}$, since then $\lambda$ diminishes and $(1-\lambda)$ will be larger.

Let's first write down the posterior variance from Bishop and see how we can use it to support above intuition:

$$\sigma_{new}^2 = ( \frac{1}{\sigma_{0}^2} + \frac{N}{\sigma^2} )^{-1}$$

This formula is much easier to remember in terms of precision $\tau = \frac{1}{\sigma^2}$:

$$\tau_{new} = \tau_{0} + N \tau$$

Which intuitively reads: the posterior precision is the prior precision plus N times the precision of the likelihood function.
The multiplication by N shows the again intuitive result that the more observations you make, the more "certain" the posterior distribution becomes.

It's not immediately obvious that that $\lambda = \frac{\tau_{0}}{\tau_{new}}$ so let's write it out:

$$\frac{\tau_{0}}{\tau_{new}} = \frac{\tau_{0}}{ \tau_{0} +_N \tau }$$
$$= \frac{  \frac{1}{\sigma_{0}^2} }{ \frac{1}{\sigma_{0}^2} + \frac{N}{\sigma^2}}$$

Multiplying both sides with $\sigma_{0}^2$ gives:

$$= \frac{1}{ 1 + \frac{N\sigma_{0}}{\sigma^2} }$$

Multiplying both sides with $\sigma^2$ gives:

$$= \frac{\sigma^2}{ \sigma^2 + N\sigma_{0}^2 } = \lambda$$

QED.

This results suggest that it's efficient to first compute the new variance, and then use this variance to compute $\lambda$ in the formula for the posterior mean.

So if you want to easily remember the parameter update rules, in natural language:

- The posterior precision is the prior precision plus N times the likelihood precision
- The posterior mean is a mix between the prior mean and the mean of the observed data sample
    * The mixing coefficient of the prior mean is the *prior precision* divided by the *posterior precision* which we called $\lambda$
    * $(1-\lambda)$ is the mixing coefficient of the sample mean.

## MLE for the mean

First find the expression for the Gaussian log likelihood:

$$ln p(D|\mu, \sigma^2) = ln \prod_{n=1}^N \mathbb{N}(x_n | \mu, \sigma^2)$$
$$= \sum_{n=1}^N ln \mathbb{N}(x_n | \mu, \sigma^2)$$
$$= \sum_{n=1}^N ln( \frac{1}{\sqrt{ 2\pi \sigma^2}} exp{ - \frac{(x_n - \mu)^2}{2 \sigma^2}})$$
$$= N ln( \frac{1}{\sqrt{2\pi \sigma^2}}) - \sum_{n=1}^N \frac{(x_n - \mu)^2}{2 \sigma^2}$$
$$= -\frac{1}{2 \sigma^2} \sum_{n=1}^N (x_n - \mu)^2 - \frac{N}{2} ln(\sigma^2) - \frac{N}{2}ln(2\pi)$$

The next step is to find $\mu_{ML}$ by deriving with respect to $\mu$. 
The derivative w.r.t. $\mu$ is:

$$\frac{1}{\sigma^2} \sum_{n=1}^N (x_n - \mu)$$

Setting to zero gives the MLE:

$$\mu_{ML} = \frac{1}{N}\sum_{n=1}^N x_n$$
