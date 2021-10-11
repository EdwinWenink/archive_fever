---
title: "Introducing the AI Ethics Tool Landscape"
date: 2021-08-24T09:35:29+02:00
draft: false
tags: ['AI', 'ethics']
author: "Edwin Wenink"
---

Many companies that employ AI by now recognize the need for what the European Commission calls an "ecosystem of trust" [^7].
This has resulted in a large amount of (ethical) principle statements for the usage of AI.
These statements are often to a large degree inspired by pre-existing guidelines and principes, such as the European Commission's *Ethics Guidelines for Trustworthy AI* [^9] or the SAP guiding principles for AI [^10].
However, there are doubts about the effectiveness of these guidelines.
A main challenge for the coming years is to effectively *operationalise* AI policy.
In this post I introduce an open source project that hopefully makes a step in the right direction by listing available tools to support the ethical development of AI.

The tools are described and organized in the [AI Ethics Tooling Landscape](https://edwinwenink.github.io/ai-ethics-tool-landscape/).
The website itself and the corresponding [README](https://github.com/EdwinWenink/ai-ethics-tool-landscape/blob/main/README.md) explains how the website works and how to contribute to it.

## Where guidelines fall short

AlgorithmWatch initiated an *AI Ethics Guidelines Global Inventory*
[^1] in which more than 160 AI ethics guidelines have been
collected. The organizers of this initiative noted that the overwhelming
majority of guidelines contained general promises, for example to not
used biased data, but no concrete "recommendations or examples of how to
operationalise the principles" [^3]. Evaluating the
guidelines in this repository a year later, AlgorithmWatch states that
often "it is a matter of weaving together principles without a clear
view on how they are to be applied in practice. Thus, many guidelines
are not suitable as a tool against potential harmful uses of AI-based
technologies and will probably fail in their attempt to prevent damage.
The question arises whether guidelines that can neither be applied nor
enforced are not more harmful than having no ethical guidelines at all.
Ethics guidelines should be more than a PR tool for companies and
governments" [^2]. Because most ethical guidelines do
not indicate "an oversight or enforcement mechanism"
[^3] they risk being rather toothless "paper tigers."
Ethics does by nature not include any mechanisms for its own enforcement
and the active promotion of ethics guidelines is even seen by some as an
attempt to preemptively stifle the development of more rigid AI
legislation that *does* enforce compliance [^8].
This suspicion that companies use ethics guidelines as a PR tool can
lead to accusations of *ethics washing* [^5].

## A call for operationalisation

This shows that despite a proliferation of principle statements --- the
"what" of ethical AI --- there is not enough focus on the "how" of
ethical AI. Papers that review the operationalisation of AI principles point out that currently these principles do "not yet bring
about actual change in the design of algorithmic systems" [^11].
In a similar vein, Hagendorff points out that "it is
noteworthy that almost all guidelines suggest that technical solutions
exist for many of the problems described. Nevertheless, there are only
two guidelines which contain genuinely technical explanations at all ---
albeit only very sparsely" [^8]. Equally stern,
Canca concludes that "the multiplication of these mostly vaguely
formulated principles has not proven to be helpful in guiding practice.
Only by operationalizing AI principles for ethical practice can we help
computer scientists, developers, and designers to spot and think through
ethical issues and recognize when a complex ethical issue requires
in-depth expert analysis" [^6].

These citations from review papers show that there are serious doubts,
to put it mildly, about the effectiveness of guidelines. These
guidelines are great public statements, but how do we make sure they
actually impact the work being done in professional AI communities? A
main challenge for AI ethics and ethical AI in the coming years is
therefore "to build tangible bridges between abstract values and
technical implementations, as long as these bridges can be reasonably
constructed" [^8].

## Bridging the gap

This call for concretisation and operationalisation of AI principles
does not mean, however, that AI principles can always and
straightforwardly be technically implemented in a tool or computer
program. 
This tension between abstract principles and concrete tools requires thoughtful navigation. 
From the perspective of principles, there is a strong call to make them as concrete as possible so that they can
be used by the professionals actually creating AI applications. In this
context, Hagendorff calls for a "microethics" [^8]
that engages with technical details, such as the way algorithms are
designed, or how data is used throughout a machine learning pipeline.
From the perspective of existing tools and techniques, it should instead
be emphasized that they are not "plug-and-play" solutions to make an AI
application ethical. Instead, appropriate use of these tools requires an
ethical sensitivity, with attention to the context in which an AI
technique is embedded and used. For example, if you use a fairness tool,
which definition of fairness is used and is this definition appropriate
given the type of application you are developing?

## The AI Ethics Tool Landscape

To these ends, I did an explorative study of the available tools and techniques for ethical AI. 
The target audience that would use these tools are developers, so I
wanted to tailor the format in which I presented my insights to
developers. The majority of the tools are technical, but the value
"accountability" includes non-technical tools, that nevertheless meet
the criterion that they provide hands-on guidance for developers to
engage with ethical AI. Instead of writing a large document on these
tools --- which no developer would ever read --- I decided to program a
website from scratch in the style of a *wiki*.

The website is called the [AI Ethics Tooling Landscape](https://edwinwenink.github.io/ai-ethics-tool-landscape/) and is set up as an open source project. 
The website and corresponding [README](https://github.com/EdwinWenink/ai-ethics-tool-landscape/blob/main/README.md) explains how the website works and how to contribute to it.
Specifically, because the project content is completely based on simple text files that are automatically parsed, little to no technical know-how is required to contribute content.

Each tool is placed in a conceptual taxonomy, which I based on 1)
existing typologies and taxonomies for categorizing (machine learning)
tools [^11][^4], 2) insights from my study of
e.g. explainability and fairness, 3) things that are very practical to
know for developers, such as the programming language of the tool or
which frameworks are used. For example, Morley et al. used a matrix with
ethical values on the x-axis and the development stage in which a
technique applies on the y-axis. Similarly, the wiki categorizes tools
by the *value* they support (accountability, explainability, fairness,
privacy, security) and the *stage* in which they are useful (design
phase, preprocessing, in-processing, post-processing). I fine-tuned the conceptual taxonomy incrementally based on feedback from developers.
Morley et al. use more stages, but this results in
an extremely sparse matrix. Based on feedback that the stages were
indeed a bit too complicated, I came to the current broader stage
categories, which are also used in the `fairlearn` tool.

However, due to the digital design of the website, I was not limited to
a 2D matrix. Tools are also categorized on the following properties:
whether they are model-agnostic or -specific; which type of data the
tool handles; which type of explanation is supported (if applicable);
which type of fairness is supported (if applicable); which programming
framework is compatible (e.g. PyTorch); which programming languages are
supported; and which machine learning tasks are relevant.

An interesting observation is that the tooling landscape is not
uniformly distributed. Significantly more technical tools are available
for the values explainability and fairness than for privacy and
security, which reflects that the research field on topics like
differential privacy and adversarial AI are relatively young.

At the time of writing, the website project contains 41
custom-made tool entries. Each of these entries contains metadata to
categorize the tool, as well as my description of the tool with relevant
information. All values, stages, explanation types, and fairness types
have their own guiding descriptions as well. 


[^1]: AlgorithmWatch. AI Ethics Guidelines Global Inventory. url: https://inventory.algorithmwatch.org/ (visited on 03/16/2021).
[^2]: AlgorithmWatch. In the realm of paper tigers - exploring the failings of AI ethics guidelines. Apr. 28, 2020. url: https://algorithmwatch.org/en/ai-ethics-guidelines-inventory-upgrade-2020/ (visited on 08/04/2021)
[^3]: AlgorithmWatch. Launch of our 'AI Ethics Guidelines Global Inventory'. Apr. 9, 2019. url: https://algorithmwatch.org/en/launch-of-our-ai-ethics-guidelines-global-inventory/ (visited on 08/04/2021).
[^4]: Alejandro Barredo Arrieta et al. "Explainable Artificial Intelligence (XAI): Concepts, taxonomies, opportunities and challenges toward responsible AI". In: Information Fusion 58 (2020), pp. 82-115. doi: https://doi.
org/10.1016/j.inffus.2019.12.012.
[^5]: Elettra Bietti. "From Ethics Washing to Ethics Bashing: A View on Tech Ethics from within Moral Philosophy". In: Proceedings of the 2020 Conference on Fairness, Accountability, and Transparency. FAT* '20. Barcelona, Spain: Association for Computing Machinery, Jan. 2020, pp. 210-219. doi: 10.1145/3351095.3372860.
[^6]: Cansu Canca. "Operationalizing AI Ethics Principles". In: Commun. ACM 63.12 (Nov. 2020), pp. 18-21. doi: 10.1145/3430368.
[^7]: European Commission. White Paper On Artificial Intelligence - A European approach to excellence and trust. Tech. rep. Brussels: European Commission, 2020, p. 27.
[^8]: Thilo Hagendorff. "The Ethics of AI Ethics: An Evaluation of Guidelines". In: Minds and Machines 30.1 (2020), pp. 99-120. doi: 10.1007/s11023-020-09517-8.
[^9]: High-Level Expert Group on Artificial Intelligence. The European Commission's high-level expert group on Artificial Intelligence: Ethics guidelines for trustworthy AI. Tech. rep. European Commission, Apr. 8, 2019, pp. 1-39.
[^10]: Corinna Machmeier. SAP's Guiding Principles for Artificial Intelligence. Sept. 18, 2018. url: https://news.sap.com/2018/09/sap-guiding-principles-for-artificial-intelligence/ (visited on 08/04/2021).
[^11]: Jessica Morley et al. "From What to How: An Initial Review of Publicly Available AI Ethics Tools, Methods and Research to Translate Principles into Practices?. In: Science and Engineering Ethics 26.4 (2020), pp. 2141- 2168. doi: 10.1007/s11948-019-00165-5.
