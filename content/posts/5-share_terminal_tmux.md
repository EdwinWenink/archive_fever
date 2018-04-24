---
author: "Edwin Wenink"
title: "Terminal sharing with tmux"
date: 2018-04-25
draft: false
tags: ["tmux","ssh","partner","programming"]
---

For a while now I have been wondering how to share my terminal with others, for two reasons.
First of all, I was intrigued by the idea of remote partner programming.
For practically all of my study projects I have to do partner programming, which often means I work with someone on the same machine.
One small complication however is that I almost exclusively work together with Germans, who inconveniently use a different keyboard layout.
Most special signs (such as brackets, which are absolutely necessary in programming) are all over the place. 
Typing on those keyboards is a frustrating experience, but even without taking that into account: it is always preferable to work in a familiar environment on your own machine. 
So what if we can work together in the same virtual environment while simultaneously having the comfort of looking at our own screens? 
An obvious drawback of sharing a terminal session is that we are locked in the terminal: no graphical applications, no fancy IDE's. 
However, lately I have been using vim more intensively, and this drawback perhaps motivates me to try and turn vim into a nice IDE that is usable in any terminal.
The chances that I will actually use this are probably fairly slim, but I like the idea that I *could*.

A second and somewhat trivial reason, is that a friend recommended a game for in the terminal which I wanted to try out. He asked me if he could watch along as I played, to help me get started (the game is called 'cataclysm' by the way). 

What follows is a guide how to share a terminal session with minimal means: only tmux is required.

I am assuming ssh is properly and safely set up.
Consider reading **this post**.

## Basic idea

*This basic idea gives another user access to your system*

On your host/server, create a tmux session and attach to it:

``` 
tmux new -s shared
tmux attach -t shared
```

Connect to the host over ssh from another pc:

```
ssh -p port address
```

Show current tmux clients running on the server, and attach to the existing session.

```
tmux ls
tmux attach -t shared
```

You are now both working in the same session. Changes can be made by both partners and are shown in real time.

## Assign each partner a separate independent window

Only the last step differs. Instead of joining the same sessions, the user connecting to the tmux server makes a new session and assigns it to the same window group as the session we just called shared.

```
tmux new -s newsession -t shared
```


