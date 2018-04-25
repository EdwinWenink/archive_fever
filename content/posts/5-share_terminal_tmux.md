---
author: "Edwin Wenink"
title: "Terminal sharing with tmux"
date: 2018-04-24
draft: false
tags: ["tmux","ssh","partner","programming", "linux"]
---

For a while now I have been wondering how to share my terminal with others, for two reasons.
First of all, I was intrigued by the idea of remote partner programming.
For practically all of my study projects I engage in partner programming, which usually means I work with someone on the same machine.
One small complication however is that I almost exclusively work together with Germans, who inconveniently use a different keyboard layout.
Most special signs (such as brackets, which are absolutely necessary in programming) are all over the place. 
Typing on those keyboards is a frustrating experience, but even without taking that into account, is it preferable to work in a familiar environment on your own machine.

So what if we can work together in the same virtual environment while simultaneously having the comfort of looking at our own screens? 
An obvious drawback of sharing a terminal session is that we are locked in the terminal: no graphical applications, no fancy IDE's. 
However, lately I have been using vim more intensively, and this drawback perhaps motivates me to try and turn vim into a nice IDE that is usable in any terminal.
The chances that I will actually use this are probably fairly slim, but I like the idea that I *could*.

A second and somewhat trivial reason for me to share my terminal, is that a friend recommended a game for in the terminal which I wanted to try out. He asked me if he could watch along as I played, to help me get started (the game is called 'cataclysm' by the way). 
What follows is a guide how to share a terminal session with minimal means: only tmux is required.
I am assuming ssh is properly and safely set up.
Consider reading [this post](https://edwinwenink.xyz/posts/3-ssh+tmux/).

## Basic idea

*This basic idea gives another user access to your system. Make sure to take the necessary precautions. For example, make a separate user in your system with restricted rights for pair programming. I discuss this option below.*

On your host/server, create a tmux session and attach to it:

```bash
tmux new -s shared
tmux attach -t shared
```

Connect to the host over ssh from another pc:

```bash
ssh -p port address
```

Show current tmux clients running on the server, and attach to the existing session.

```bash
tmux ls
tmux attach -t shared
```

You are now both working in the same session. Changes can be made by both partners and are shown in real time.

## Assign each partner a separate independent window

Only the last step differs. Instead of joining the same sessions, the user connecting to the tmux server makes a new session and assigns it to the same window group as the session we just called shared.

```bash
tmux new -s newsessionname -t shared
```

Or achieve the same effect with:

```bash
tmux new-session -t 'original session name'
```

If you now run " tmux -ls ", a short-hand for tmux list-sessions, we see that we have two sessions belonging to the same group. If we only have one window, we do not notice any difference with a setup not sharing a group. However, if we make a new window with "Control-b c", and then select it with "Control-b windownumber", we are able to switch to another window where we do not share a cursor with our programming partner. However, at any time we can come back to the original window, or conversely our partner can come visit our window to cooperate.

You can now take turns writing code, conquering *Zeit-Raum*.

#### Towards a more secure setup: creating a guest user and connecting with it

If you do not use a server but your machine to ssh into, then you probably want to prevent someone gaining full access to your files. One option is to create a separate user account on your system for guests, that has restricted permissions and do not have access to your precious home folder, nor permission to change any essential files. Let's say we make a user called 'pair':

```bash
useradd -m pair
```

This creates a user 'pair' on your system. The -m flag creates a home directory for this user. I assume here that by default a new user does not have sudo rights, but make sure to double check this. You also want to set a password for this user:

```bash
passwd pair
```

Once we have the user set up as we want to, we have another challenge. When we run a tmux server on our own account, that server is not visible to the new user 'pair' when we check the available sessions with "tmux -ls", because that only shows the sessions running in the terminal of one particular user. 
Somehow, we need a way to let tmux communicate between users. We can achieve this by opening a socket:

```
tmux -S /tmp/socket
```

As far as I'm currently aware of, this creates a temporary soft link through which other users can link to the tmux session. I placed it in the /tmp/ folder because our newly created 'pair' user can read that file. However, the 'pair' user does not yet have the right permissions. A quick way to fix this is to run:

```
chmod 777 /tmp/socket
```

Another tactic could be to create a custom group with the right permissions, to which only your main account and the guest account belong.
The 'pair' user can now connect to your session through the socket using:

```
tmux -S /tmp/socket attach
```

Note however that if you let the guest user connect through the socket to your main user, that user gains access to the terminal as you, which means: it gets the permissions we denied it in the first place. Since you have sudo rights, a safer option would instead be to create the session on the 'pair' account and join that session. I guess everyone has to make the decision to what extent the programming partner is trusted not to engage in "funny business" on your home account. As long as the guest does not know your sudo password, the risks are still somewhat limited, but the guest does have acccess to your home folder, which is something to consider. I do not have actual working experience with both setups, and am not aware of the usual standards for remote pair programming, so perhaps I update this post later. I assume the standard is to use a server in the cloud, which circumvents all problems I pose here in the first place. As of now, I do not have such a server myself though.

If your intent is not pair programming, but *only* sharing your terminal, then there is a solution though. If you force a guest user to enter the tmux session in read-only mode immediately upon connecting over ssh, then there is no way to exit the tmux session and gain access to your home account. Of course the guest can decide to detach from the tmux session, but in that case is simply returned to its own home folder. So unless a malicious user detaches, finds the socket to connect, and also knows your sudo password, you should be fine in this case.

To enter in read-only mode, attach the -r flag:

```
tmux -S /tmp/socket attach -r
```

#### Mixing it all up

Let's apply the previous and combine it with the possibility of having independent windows. Run:

```
tmux -S /tmp/socket new-session -t sessionnameorid
```

#### Making the guest automatically connect to the socket session

Since we made the guest account 'pair' solely for sharing our terminal, it makes sense to let anyone who connects to it over ssh automatically connect to our tmux session through the designated socket. To achieve this, we can edit our /etc/ssh/sshd_config file (solution found [here](http://consileonpl.github.io/2014/04/25/sharing-tmux-sessions)). Add the following for pair programming: 

```
Match User pair
  ForceCommand /usr/local/bin/tmux -S /tmp/socket new-session -t shared
```

We assume here the session we created over the socket is named "shared", which is convenient if we want to automate this process. 
Again, if we always want the guest user to connect in read-only mode for simple terminal screen sharing, instead enter:

```
Match User pair
  ForceCommand /usr/local/bin/tmux -S /tmp/socket attach -t shared -r
```

Have fun!
