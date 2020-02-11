---
title: The Raven Paradox of Inductive Reasoning
author: Edwin Wenink
date: 2020-02-11
tags: [logic, induction, paradox]
---

The Raven paradox, coined by Carl Gustav Hempel in the 40s, formulates an interesting problem with inductive inference, more specifically, enumerative induction.

Inductive inference is a type of reasoning where you infer a hypothesis or proposition after observing a series of data.
This movement from observation to hypothesis is important for scientific reasoning in empirical science. 

For example, if you observe a thousand black ravens, you may reasonably conclude that all ravens are black. 
However, you would probably not arrive at this conclusion after only seeing a few black ravens.
In other words, the more black ravens you see, the more confidence you gain in your proposition that all ravens are black.

The question is, of course, how we can *justify* this increase in confidence?
A well-known problem with inductive reasoning is that, unlike deduction, it is not logically valid: the fact that you've seen a thousand black ravens does not *logically* entail that the 1001th raven will also be black.
In other words, the correctness of inductive inference cannot be shown deductively (but also not using induction, because that would indefinitely shift the burden of proof to having to proof your proving method... ).

The Raven paradox is a second logical challenge, but rather concerns the usefulness of induction as a *description* of how we become more sure after more observations.
The claim that all ravens are black can be cast in the form of a logical implication:
```
for all x:Rx -> Bx
```

where Rx means "x is a raven" and Bx means "x is black".
Remember, this proposition is inferred from the many observations of `Bx`.

But Hempel points out that when we rewrite this statement to the following logically equivalent proposition, things get counter-intuitive:

```
for all x: ~Bx -> ~Rx
```

For reference, we can see that these two formulas are indeed logically equivalent with a simple truth table:

| p     | q   | ~q  | ~p | p -> q    | ~q -> ~p  |
|:-----:|:---:|:---:|:-: |:---------:| :-------: |
| 0     | 0   | 1   | 1  | 1         | 1         |
| 1     | 0   | 1   | 0  | 0         | 0         |
| 0     | 1   | 0   | 1  | 1         | 1         |
| 1     | 1   | 0   | 0  | 1         | 1         |

We already knew that seeing more black ravens increased our confidence that all ravens are black.
But what rewriting the proposition suggests is that we then should also be more confident that all ravens are black when we encounter any object that is not black and not a raven.
Although being logically equivalent, this statement suddenly no longer accurately describes how we become more sure that all ravens are black. 

Does my confidence that ravens are black increase when I see a yellow banana?

Not quite.
It is clear that seeing a yellow banana is completely irrelevant when considering the proposition that Ravens are black, but the logical formalization of the inferred rule on black ravens does not express this. 

[Peter Lipton]( https://onlinelibrary.wiley.com/doi/abs/10.1002/9781405164481.ch29 ) points out that this issue of relevance similarly plagues existing models of scientific explanation, particularly the so-called Deductive-Nomological model.
In the summary of Lipton, this model states that "an event is explained when its description can be deduced from a set of premises that essentially includes at least one law".
So to cast this into the raven example, our hypothesis may be that "All ravens are black," from which we can deduce that if we encounter a raven, we predict it to be black.
If this indeed turns out to be the case, this would be support for our hypothesis.

But Lipton points out that a successful prediction could be construed as support for any hypothesis, logically speaking.
If our hypothesis is `B` (all ravens are black) and we observe indeed many black ravens, then our confidence in `B` increases, but logically speaking, so would our confidence in the hypothesis `B \/ P` because adding a disjunction is truth preserving: if `B` is true, then `B \/ P` is necessarily also true.
And `P` might mean anything here, for example that "Cows can fly." 

Granted, the hypothesis "All ravens are black or cows can fly" is a *really shitty* hypothesis.
But the main point is the same as before: how do we convincingly show and formalize that our hypothesis is *relevant* for our observation?

One interesting concept that does not disqualify inductive reasoning altogether is the idea of "inference to the best explanation," which goes back to Pierce's conception of abduction, and fits well with Bayesian formalisations.
The phrase "best explanation" suggest at least that we compare two explanations, rather than taking observations directly as support for any one given hypothesis.
How confident we are that we live in a world where all ravens are black (i.e. that this is a good explanation of the fact that so far we only seeing black ravens) does not only depend on how many black ravens we have seen, but should be expressed in relation to our confidence in other possible explanations.
If my alternative explanation is that cows can fly, I'm certainly more sure about all ravens being black.
Of course, in empirical science a good explanation should depend on a meaningful contrast with alternative explanations (so not some alternative hypothesis about banana's or flying cows).
Whether you have enough confidence to reject a null hypothesis depends on its formulation in contrast to the experimental hypothesis.

In any case, the Raven paradox raises interesting questions on what are relevant or good explanations in inductive reasoning.
