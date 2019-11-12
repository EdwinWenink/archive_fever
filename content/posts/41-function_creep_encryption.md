---
title: On function creep, privacy and encryption
author: Edwin Wenink
date: 2019-11-11
tags: [privacy, security, function creep]
---

Some technologies have the interesting property that they take on roles that were never intended or foreseen by their designers.

Johannes Gutenberg introduced the printing press in Europe, and used his technique to efficiently produce bibles and spread the word of God and the authority of the Catholic Church. 
Instead, the introduction of efficient printing techniques in Europe 
"introduced the era of mass communication which permanently altered the structure of society. The relatively unrestricted circulation of information—including revolutionary ideas—transcended borders, captured the masses in the Reformation and threatened the power of political and religious authorities; the sharp increase in literacy broke the monopoly of the literate elite on education and learning and bolstered the emerging middle class" ([Wikipedia](https://en.wikipedia.org/wiki/Johannes_Gutenberg)). 

The technology of mechanical printing changed European civilization in spite and beyond the intentions of its designer. 
And in this case, we can applaud this as something beautiful: technology has the power to redefine the boundaries of thought and action and transform our social realities for the better.
This transformative power is in fact something that is sought after nowadays.
Take for example the Internet of Things movement that entertains the ideal of embedded and connected into our homes and ultimately our cities, to the point where they are ubiquitously shaping our life world while unobtrusively receding in the background.
Despite this being a dream for some, others see in this the voluntary and naive submission to a surveillance society. 

### Function creep and security

In other cases, the application of a technology outside of its intended context is simply inappropriate.
When it comes to security, [Bruce Schneier](https://www.schneier.com/essays/archives/2010/01/security_and_functio.html) writes that "far too often we build security for one purpose, only to find it being used for another purpose -- one it wasn't suited for in the first place." 
The correct functioning of a technology depends on values of the social context in which they are embedded.
Schneier mentions how US driver's licences increasingly transformed from being a simple credential for showing that you know how to drive a car, to something you could use to proof your age when buying liquor.
With this changing social context, it suddenly became valuable to create fake driver's licenses, and this bumped up its security needs.
Another one: "Security systems that are good enough to protect cheap commodities from being stolen are suddenly ineffective once the price of those commodities rises high enough."
Security measures are always taken relative to how much time and money you expect an attacker to put in. 
When the value of the thing you secure goes up, your security measure goes from being appropriate to being a laughing stock.

The use of a technological design beyond its intended purpose is called *function creep*.
This is not only a potential issue for security, but also for privacy if the function creep involves personal data.
The linking of personal data from various sources can lead to a quite accurate personal profile that may lead to some convenient applications, such as a personalized search experience, but also to [political microtargeting](https://www.utrechtlawreview.org/articles/abstract/10.18352/ulr.420/) that may disrupt the democratic political process.
The issue here is not just the particular usage of personal data that may be desirable or not, but that often the data is originally collected for other purposes.
The public outrage about the Cambridge Analytica-scandal is understandable because personal data collected in the context of a social network was used in another context for the Trump campaign. 
Those people may have consented to sharing their data with Facebook, but would likely not have consented to their data being used for a political campaign.

### Function creep and contextual integrity

Why function creep is such a threat to privacy is best explained by Helen Nissenbaum's concept of contextual integrity. 
When we visit a doctor we consent to disclosing very personal information so that the doctor can adequately help us (we are obliged to give the doctor complete and accurate information, actually).
If you agree that this is not a privacy breach, then you should also agree that privacy is more than straight up secrecy or confidentiality.
But consent in the context of the examination room does not mean that the doctor can share this information outside of this well-defined context of medical practice.
You do however likely accept that the doctor may need to consult with a specialist.
Privacy is thus more than confidentiality or being in full control of your data at all times.
The relative importance of all these aspects of privacy are heavily context dependent, and can therefore not simply be translated from one context into another. 
So neither can consent.

For the course where I work as a teaching assistant, students were asked to give an example of function creep, some positive and negative implications and how to resolve the negative implications.
Reading the resulting small essays were proof of the importance of teaching, as they forced my to formulate my own thoughts on the subject.
I noticed one trend in particular, namely that many students proposed encryption as a solution to the privacy issues concerning function creep.

### Is encryption a solution?

Some students found [a blog of Michael Zimmer](https://www.michaelzimmer.org/2007/06/30/function-creep-101-surveillance-cameras-and-social-norms/) where he gives an example of privacy invasion due to function creep.
He mentions how a dean of a Washington high school thought he saw two girls kissing. 
A quick check with the footage of the surveillance camera confirmed this, and the dean consequently informed the parents of one of the girls about this.
The girl got pulled out of school. 
The presence of a surveillance camera is acceptable for ensuring public safety, but was instead used to enforce social norms: textbook function creep (and perhaps the dean was an actual creep, who knows).

In this scenario the inappropriate function creep is caused by human interference. 
One proposed solution was thus the design of an autonomous AI system that encoded the video material and only extracted features relevant for its goal: ensuring public safety.
Another proposal was to encrypt all collected data, so that explicit permission to use the data is always needed. 
Let's leave the technical feasibility of these proposals aside for now.

These answers make sense given that they seem to assume that function creep is due to explicit human involvement (and specifically, with less than pure intentions).
Encrypting data is indeed very important for protecting sensitive data against people with bad intentions that try to steal and misuse that data. 
But I would argue that function creep does not depend on this explicit human interference. 

Good encryption ensures data *protection*, which is preceded by the moment of data collection.
Compare how the GDPR battles function creep: before collecting data you have to specify exactly for what you intend to use it, why your need for that data is legitimate, and how long you need it. 
Function creep is thus already relevant at the stage of *collecting* data and specifying the purpose of data collection.
This process of data collection can be fully automated without humans necessarily trying to make inferences on particular individuals. 
It doesn't matter that this data might subsequently be encrypted. 
The critical point is that no data is used that was originally recorded for another *purpose*.

Encryption also raises the question: Encrypted by who? Who is in control of the data?
Let's say a law obliges me to encrypt the data I gathered. 
Since I have the key to decrypt the data, I can still use the data when I need it, potentially for another purpose than the one I stated when I collected the data. 
In other words, misuse by the data controller is not necessarily counteracted by the technical measure of encryption alone.

I would thus say that even though encryption is extremely important for data protection, it does not *in itself* prevent function creep.
However, that does not mean that encryption cannot help battling function creep.
The app IRMA, developed by the [Privacy by Design foundation](https://privacybydesign.foundation/) and with heavy ties to Radboud University, offers attribute-based authentication with zero-knowledge proofs in a way that is sensitive to contextual integrity. 
I can for example load the attribute that I'm an inhabitant of Nijmegen from the local municipality into IRMA. 
If I need to authenticate to an application that needs to know where I live, I can prove that I indeed own this attribute without disclosing any other attributes, such as my age.
Likewise, I can prove that I'm older than 18 to another application, without having to disclose my exact age (zero-knowledge proof) or disclose where I live (irrelevant attribute).
The context sensitivity thus consists in that the user remains in control of which attributes to disclose in each particular context, without having to give away more information.

Such use of encryption addresses the two main points I thought the above answers on encryption missed.
Firstly, IRMA is sensitive to contextual integrity because it uses cryptography to ensure only relevant attributes are used, for which the purpose of original collection matches the legitimate use case of the app.
Secondly, IRMA addresses the question who is in control of the data by giving the user control over identity management and the authentication process. 

This does not solve issues with surveillance of course, but was the first thing that came to my mind when thinking about a way in which encryption might help to battle privacy-invading function creep. 
Privacy by design is a good example of how ethical and societal values can be *embedded* in a responsible design practice.
