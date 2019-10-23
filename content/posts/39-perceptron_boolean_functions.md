---
title: How many 2-ary boolean functions can a perceptron model?
author: Edwin Wenink
date: 2019-10-23
tags: [perceptron, boolean, math]
---

Matt Might wrote [6 blog tips for busy academics](http://matt.might.net/articles/how-to-blog-as-an-academic/), and I am intending on following all tips. 
This post follows two tips specifically.

> Tip 2: "Reply to public" as post<br>
<br>
>  Many of the academics that "don't have time to blog" seem to have plenty of time to write detailed, well-structured replies and flames over email.<br>
<br>
> Before pressing send, ask yourself, should this answer be, "Reply," "Reply to all," or "Reply to public"?<br>
<br>
> If you put effort into the reply, don't waste it on a lucky few. Share it. 

And also a part of tip 3:

> Any question asked more than once is a candidate for a blog post

Today I graded assignments about perceptrons learning to model logical functions, such as A /\ B or A \/ B. 
As a warm-up question first year students were asked how many boolean functions we can define for two and three inputs respectively. 
And in the case of two inputs, how many of those boolean functions can a perceptron model?
I noticed that quite some people did not answer these questions correctly, and moreover I received emails asking me to explain the answer because the final exam is coming up in two days. 
And so I heard Matt Might's voice calling me out to write this.
I hope it is of use to someone out there.
I suggest you give it a try yourself before looking at the answer!

- What is a boolean function?
- And how many boolean functions are possible for `n` inputs?
- Using that formula, how many boolean functions with 2 inputs can be modeled with a single layered perceptron?

I like to think of a function informally as a mapping from inputs to outputs such that each possible input has exactly one output.
A Boolean is a data type that can take on two values that usually represent a truth value, for example in classical logic or programming. 
Classical logic makes the assumption of the excluded middle, namely that any proposition P is either true or not true (false): `P \/ ~P`.
In computer science and programming, truth is usually denoted with a `1` and non-truth with a `0`.
So a boolean function is a mapping such that it takes an amount `n` of inputs and then returns true (`1`) or false (`0`). 
We could write that as such:

`f: {0,1}^n -> {0,1}`

We can see that the amount of inputs `n` determines the space of possible inputs. 
The question how many boolean functions there are for `n` inputs can thus be formulated as such: in how many ways can we map the set of all possible inputs to the set of possible outcomes?
Another name for such a mapping is a *truth table*. 
For example, this is the truth table of the logical disjunction `A \/ B`:

<pre>
	A B | A \/ B
	1 1 |   1
	0 1 |   1
	1 0 |   1
	0 0 |   0
</pre>
<br>

This truth table corresponds to *one* boolean function, because it maps each possible input to exactly *one* output. 
Another way of asking how many boolean functions we can make with `n` inputs is thus: how many of these truth tables are possible?

Notice that the disjunction above is a boolean function with 2 inputs that we here called A and B.
Each input can take two values because it is either true or false, so there are in total 2^n possible options for the inputs.
In other words, for 2 inputs we know that our truth table has `2^2=4` rows.

But notice that the ordering of the output column in the truth table matters!
For example, if we switch the last two outputs of the disjunction, we end up with a different truth table and thus a different boolean function, which happens to be the material implication:

<pre>
	A B | A -> B
	1 1 |   1
	0 1 |   1
	1 0 |   0
	0 0 |   1
</pre>
<br>

So given that each truth table has `2^n` rows, we now need to know how many possible sequences of 1s and 0s we can have in the output column. 
This is equivalent to throwing a coin for 2^n times and writing down all possible outcome sequences of head and tails. 
How many of those sequences are possible?
Well, the outcome is again either `1` or `0`, so for each row we have two options. 
We already established we have `2^n` amount of rows. 
So for `n` inputs, we have 2<sup>2<sup>n</sup></sup> possible truth tables, and hence so many boolean functions.

For 1 input, it's not much work to draw out all `2^(2^1) = 4` options:

<pre>
A |  o1   o2   o3   o4
0 |   0    0    1    1
1 |   0    1    0    1
</pre>
<br>

Likewise, for two inputs we have `2^(2^2)=2^4=16` possible boolean functions,
and for three inputs `2^(2^3)=2^8=256` possible boolean functions.

Now, the more interesting follow-up question was: how many of these boolean functions with two inputs can be modeled by a single-layered perceptron?

Perceptrons can model logical functions by classifying everything on one side of a decision boundary as true, and false on the other. 
Using the perceptron learning rule we can learn this decision boundary in a supervised manner by iterating over examples from the truth table of the function we want to model, but that's a topic for another day.
Such a decision boundary looks like so:

<figure>
   <img align="center" style="width:50%" src="https://qph.fs.quoracdn.net/main-qimg-1c09630a3251cc3f35081ca127a607f9-c" />
   <figcaption> Example of a decision boundary for the logical conjunction /\ </figcaption> </img>
</figure>
<br>

From the 16 possible boolean functions with two inputs, perceptrons can thus model those whose layout allows all positive instances to be separated from the negative instances. 
This is only not possible for the XOR and its negation, the XNOR. 
Boolean functions where each input is mapped to true, or each to false, can actually be modeled with a decision boundary far off to the side. 
So single-layered perceptrons can model `16-2=14` boolean functions.

