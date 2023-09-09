---
title: "Self portraits using stable diffusion"
date: 2023-09-09T16:21:46+01:00
draft: false
author: "Edwin Wenink"
tags: ['AI', 'art']
image: 'images/diffusion/diffusion_self_portrait.jpg'
---

I was in need of a head shot, but I don't like taking pictures.
Being a programmer I figured, why not let AI magically turn a messy selfie into a proper professional head shot?
As it turns out, there's quite a market for AI tools that generate professional portraits that are suitable for LinkedIn and such, but they were requesting fees I wasn't willing to pay.
I hoped to do some experiments on a Midjourney trial license instead, but they discontinued those.
*No problemo*, this is how this post was conceived: let's see how far we get with a pretrained *stable diffusion* model without further fine-tuning on my face.

I used [CompVis/stable-diffusion-v1-4](https://huggingface.co/CompVis/stable-diffusion), which was initially trained on 256x256 images from [laion-aesthetic](https://laion.ai/blog/laion-aesthetics/) data sets and further fine-tuned on 512x512 images.
This is a text-to-image model trained to generate images based on a text prompt describing the scene, but it's also possible to initialize the inference process with a reference picture.
It's possible to tweak the relative strength of the reference image and the "hallucination" of the model based on the prompt.
I played around with two selfies that I cropped to a 1:1 ratio and then resized to 512x512.
The first reference picture was a selfie with my *huge* Monstera in the background.
The "head and shoulders" setup is also quite common for portraits so I expected this layout to be well represented in the training data.

<figure style="width: 50%; margin-left: 20px; margin-bottom: 10px; float: right;">
<img src="/images/diffusion/not_quite_edwin.jpg" alt="Dreams of Edwin." />
<figcaption>Dreams of Edwin.</figcaption>
</figure>

It's not hard to generate stunning pictures if you let the model hallucinate.
The top two pictures are very loosely inspired by the reference picture (the green from the Monstera subtly returns in the background; heavy mustache) but don't look like me at all.
The next two pictures attribute more importance to the reference picture and stay close to the original layout of the scene and main characteristics of my face (mainly my hair and beard style), but other than that didn't look like me at all.
My main observation at this point is that ...

> trying to stay close to a reference portrait without fine-tuning on the subject is a one-way ticket to the *uncanny valley*.

I was initially sceptical, but by now I'm convinced that using generative AI in this manner to create a specific picture you have in mind truly is a creative process.
It is similar to how a professional photographer sets up the environment for the right snapshot: the art is not in the pressing of the button, but on using the tools available to materialize something that only existed in your mind's eye so far.
Similarly, prompt engineering is an art in the sense that over time you start to get a feeling for which prompts are successful of manipulating this stochastic "obscene hallucination machine" in a desired direction.

<figure style="width: 50%; margin-left: 20px; margin-bottom: 10px; float: right;">
<img src="/images/diffusion/edwin_alphone_mucha.jpg" alt="Edwin interpreted in jugendstil à la Alphone Mucha." />
<figcaption>Edwin interpreted in jugendstil à la Alphone Mucha.</figcaption>
</figure>

<figure style="width: 50%; margin-left: 20px; margin-bottom: 10px; float: right;">
<img src="/images/diffusion/edwin_and_vincent.jpg" alt="Edwin and Vincent." />
<figcaption>Edwin and Vincent.</figcaption>
</figure>

The breakthrough where I started seeing results that I liked was when I started including the names of painters and artists.
For example, I added jugendstil artist Alphone Mucha to the prompt.
These results are obviously not "realistic," but in for example the top left picture I started recognizing a bit of myself in the glance of the eyes.
The style worked really well with the Monstera in the background.

I tend to be compared to Vincent van Gogh and you can probably see why in the final results.
These are based on a different picture that I sent to my better half when I was, quite frankly, done with my day.
When I threw Vincent van Gogh and Edvard Munch in the mix, I finally managed to produce a stylized version of a picture that actually looked like me.
Lo and behold, the top left picture is a stylized and "painted" version of what I actually look like.
Everyone that knows me will immediately recognize me in this picture.

To achieve the goal of getting a professional looking head shot, the next step is to finetune a stable diffusion model on pictures of my own face.
This should make it possible to let the model do its magic on the background and the styling, but stay closer to my actual face.
