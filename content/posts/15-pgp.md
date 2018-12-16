---
author: "Edwin Wenink"
title: "Creating a PGP key, sending mail with GPG"
date: 2018-12-16
draft: true
tags: [Security, Encryption, Privacy, Pgp, Gpg, Neomutt]
---

I added my public PGP key to this website (<a href="https://www.edwinwenink.xyz/page/pgp.html"> here </a>) so you can send me encrypted email if you would like to.
PGP stands for "Pretty Good Privacy". 
I used the free software GPG (Gnu Privacy Guard) program that implements the OpenPGP standard, and for which most mail programs have extensions or native support.
Without delving into mathematical details (about RSA for example), this post quickly summarizes how to use GPG.

# Setting up your keys

I assume here that you will be using GPG on the command line on Linux.
If you are on another system, <a href="https://gnupg.org/download/"> download </a> the appropriate version for your system.

Asymmetric cryptography uses a public-private key pair.
So we first have to make GPG create this key pair for us.
If at any point you are lost, you can always run `gpg --help`.

To create a new key pair, run `gpg --full-generate-key` and follow the instructions.
You can accept the default for most settings.
One setting of interest is the expiration date. 
Although it sounds undesirable, you *do* want your key to expire after a certain amount of time. 
If you lose access to your own keys and you did not set an expiry date, then all the people that have your key have no way of knowing that the key is no longer valid. Whereas if you set an expiry date, everyone that has your key at least knows to no longer use it after the expiration date, somewhat mitigating the results of you losing access to your key.    
If you did not lose your keys however, you can always extend the expiration date. 
This means that you can have the added security measure of the expiration date without the inconvenience of making and distributing a new key every time.
A normal expiration time is two years. **TLDR; let the key expire after 2yrs**.

The generated keys are stored in a keyring, which is by default ~/.gnupg/pubring.kbx.
It depends on your system whether you have a nice GUI for managing all your keys.
GNOME-users for example have the `seahorse` program. 
If you want to check your own public keys and the keys of others you stored using GPG on the command line, simply run `gpg -k`. You can also inspect your private key, but people handling a private key need to know what they are doing and can figure that out themselves.

Find the key associated with your email (the `uid`) entry. 
The `pub` entry shows, amongst other things, the expiration date and the fingerprint of your public key. 
Usually people share their key in so-called "ascii armored" form, like I did on this website. 
To produce this ascii form of your key, copy your aforementioned public key fingerprint (a long string of random numbers and letters) and run `gpg -a --export [yourfingerprintgoeshere]`.
If you want to directly write the command output to a file in the current directory, run `gpg -a --export [yourfingerprintgoeshere] > my_pub_pgp_key.txt`.

# Encrypting and signing

So what can you do with this key? 
In this post I assume you will use GPG for sending mails.
You can do two things, 1) encrypt your email to me, so that only I can read it, or 2) sign your email, so that I can verify that it was indeed you that sent the mail. 

If you want to write me an email, you have to encrypt the mail with *my* public key. 
Then I can decipher it with my *private* key. 
If you want me to respond to you, you need to make your public key available to me, so I can do the same.

For signing the public and private key are used slightly different.
If I sign an email, I sign it with my *private* key, which obviously only I should have. 
My signature can be verified by *anyone* having my public key. 

# Mail integration

You do not have to do this manually. Your mail program probably has an extension or native support for using PGP encryption (also with GPG). 
If you use ThunderBird, for example, you can install the <a href="https://enigmail.net/index.php/en/"> EnigMail extension</a>.
I use the command line based program <a href="https://neomutt.org/"> NeoMutt</a> myself.
NeoMutt has native support for using PGP encryption. In order to tell it that I use GPG for that, I only need to allow NeoMutt to use `gpgme`, which is GPG's standard library for accessing GPG functionality from other programming languages. (This is assuming you have the latest GPG version installed).

So in my neomuttrc file I set: 

`set crypt_use_gpgme=yes`

And if I want to sign my mails by default, I can simply set:

`set crypt_autosign`

When having written an email, you can press `p` to open all encryption options.

# Web of trust

The added security of PGP depends on the fact that the public key that I gave you, is *really mine*, and not of someone pretending to be me. 
Therefore you should review your trust into public keys. 
The most secure option is to manually verify with the person you are trying to reach that the public key is correct (e.g. by meeting or Skyping with them). 
But this is quite laborious and not feasible if you communicate with a lot of people. 
Therefore a common tactic is to build a web of trust. 
I can verify public keys of people I know by signing them with my own key. 
This then creates a situation where someone else trying to communicate with my friend sees: aha, Edwin trusts this person. Now the question is... does this person trust Edwin? 
But hey, that is lucky, a person I know and whose key I verified, turns out to trust Edwin. 
So I have now more confidence that the key of my friend is legit.
Although not waterproof, through this type of interaction you can build a so-called "web of trust". 

This does however require people to not sign keys without thinking! 
So if you like the "GPG-philosophy", that does give you some responsibility for maintaining it as well.

You can sign a key with `gpg --sign-key [thekeyfingerprintgoeshere]`.

To import a key, use the `gpg --import [keyfile]` command, or try get the key from a keyserver with the `gpg --receive-keys` command.

Try to verify and sign mine!


