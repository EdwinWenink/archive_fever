---
title: "Setting up ssh and using tmux"
author: "Edwin Wenink"
tags: ["ssh","tmux","arch","linux"]
date: 2018-04-08
draft: false
---

Ingredients: 

* ssh: the client command
* sshd: the server component
* scp: a tool to securely copy files
* ssh-keygen
* tmux

## Why SSH?

One of the reasons I was getting more and more annoyed with Windows was that it does not have a free service for remotely connecting to another pc. There are plenty of options for remote desktop sharing using third-party software (of which TeamViewer is probably the most well-known) that can be configured such that they are sufficiently safe to use. However, depending on what the remote connection is used for, the lag of remote desktop solutions can be pretty annoying. Moreover, for some reason I fixated myself on this idea to be able to connect to any computer on university, only to find out that third-party solutions could not properly be used because I had no rights to install them. Fair enough. I quickly ended up looking into Window's native protocol used in the "Remote Desktop" feature. Unfortunately I discovered quickly that although this feature was free to use if you want to connect to another PC, actually enabling others to connect to your own pc required a Windows Pro update, which I did not have and was not going to get just for having something that is free and secure on any Linux system. 

## Installation

Install the openssh protocol with your preferred package manager. In my case that is pacman:

```
sudo pacman -S openssh
```

## Configuration of the ssh server

Before being able to ssh into your machine, the daemon taking care of all the ssh business must be correctly configured according to your preferences. 
Your configuration file is usually found in /etc/ssh/sshd_config .


These are options you should consider changing from the defaults:

1) To make connections more secure and only allow known users, disallow password logins on your server. This requires validation with ssh keys to login. More on that later. Even if you enable authorization with key pairs, the server will still allow password authentication if key authentication fails, thus still exposing the server to brute force attacks.  

2) Disable root login to minimize damage to the overall system in case someone acquired unwanted access to the server. 

3) Enable X11 forwarding if you want to be able to start graphical applications over your ssh connection. It gives you permission to run X server.

4) If you want to login using ssh keys, make sure to give the correct path to where the keys are stored (more on actually generating them below). That sounds easy enough, nevertheless I did not got key authorization to work because I thought it was possible to refer to my home directory as I usually do with ~. It gave me a headache, but ones I located the issue I replaced ~ with the path variable %h instead.

```
%h/.ssh/authorized_keys
```

5) By default port 22 is used for ssh connections. You can specify another port manually. This might decrease the amount of malicious attempts to connect to your server.

## Generating keys

The server to which we want to connect now requires an ssh key for authentication, but it does not allow any connections at the moment because the .ssh/authorized_keys folder on the server side is still empty. 

Also make sure the .ssh folder has the right permissions:

```
chmod 700 ~/.ssh && chmod 600 ~/.ssh/*
```

On the client pc with which we want to connect to the server, we first need to have a pair of keys. The following command creates a private and a public key for authentication:

```
ssh-keygen
```

When generating the keyphrase you have the option to also add a passphrase as an extra security measure. By default, the public key will be stored in ~/.ssh .
The public key, as the name already betrays, can be shared and exposed to the internet. But while generating the public key, a private key that should only be known to the user is also generated. This key is the key to decrypting the information stored in the public key. So information sent over the ssh connection encrypted with my public key, can only be decrypted by the ones that have access to my private key (which is hopefully only me). 

In order to make sure our system knows what key to use for that, add the freshly generated ssh key to your "ssh-agent". 

First start the ssh-agent:

```
eval "$(ssh-agent -s)"
```

Next, we add the generated key:

```
ssh-add ~/.ssh/id_rsa
```

Note that the key here ends with 'rsa'. This is just one of the possible encryption methods, choose whichever one you like. 

The only thing we still need to do now is copy our public key to the ~/.ssh/authorized_keys folder on the server, so it allows us to connect. Copy the key in any way you like. An option is to temporarily allow password authentication on your server and run:

```
ssh-copy-id -p port remotename@remotehostaddress
```

This function is pretty robust. It tries to connect with the public keys stored on your pc and adds them to the server over a password protected ssh connection, and if this fails it adds them to the remote server. If everything is set up properly, this function should not need fancy arguments but will do the work for you.

I included the port flag just in case you followed the advise to change the default port for ssh from 22 to something else. 
Or if you want to go for sticks and stones, just use an USB stick. 

Don't forget to disable password authentication again.

## Connecting over ssh

If you want to allow ssh connections, there is one last thing you need to do: run the sshd.service daemon that allows people with the ssh tool to connect. If you want to only temporarily turn it on, run (on Arch Linux):

```
systemctl start sshd.service
```

And if you run a dedicated server to which you always want to allow ssh connections, run:

```
systemctl enable sshd.service
```

The establishment of a ssh connection should now be straightforward. Run:

```
ssh -p port remoteip
```

After running the above command, you find yourself in a single terminal logged in on the remote server. Now what? Your options are somewhat limited. If you are interested in transferring files, check out the 'scp' command. Other than that, you can do what you would also normally do with the limitation that per ssh connection you open one single terminal. Another disadvantage is that when the ssh connection is broken, any process running in that single terminal is interrupted. 

## Using Tmux

Tmux is a so-called "terminal multiplexer", which basically means that it is able to create more terminals within a single terminal. It is thus a very handy tool if you want to incorporate the ssh command into your workflow somehow. I personally don't currently use it outside of ssh-based stuff because the i3 window manager I use is already designed precisely for easily creating new windows with terminals. 

But tmux + ssh is definitely a golden combo, since you are able to overcome the limitation of only having a single terminal to run processes in. Instead of creating multiple ssh connections, you just multiplex terminals (is that even a verb?) within the same ssh session. But there is more.

The most useful advantage of using ssh in combination with tmux is probably that you can safely run a process remotely on the server, log out, and come back later to find out the process is still running. As said just now, breaking an ssh connection usually also interrupts the processes initiated through this connection. Tmux however has the possibility to "detach" a session (and it does so automatically if the ssh connection is lost), to come back to it later and "attach" to it again.
So after initiating a ssh connection, install and fire up tmux.

Detach a session:

```
tmux detach
```

List all active sessions:

```
tmux list-sessions
```

Check out the id of the session you want to attach to (or its name, if you have given it while creating it) and run:

```
tmux attach -t sessionID
```

Voila!

 __________________ 
< tmux + ssh = OK >
 ------------------ 
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
