---
title: "Setting up your own tilde club (UNIX)"
date: 2020-04-11T09:48:06+02:00
draft: false
toc: true
tags: [tilde, nginx, linux, community]
---

When I'm busy I am usually very motivated to do side projects, but paradoxically I find it harder to stay motivated and productive when I find myself with more time on my hands.
My guess is that many people noticed a similar effect during this Corona crisis, thinking something along the lines of "well at least I now have time to do project X that I've been meaning to do for a while", only to find that it's not that easy to stay motivated after being locked in the house for several days without external structure.
I felt the vague need to do a project, but more specifically I wanted it to be a project that would be collaborative and social, to make up for the social interaction lost due to Covid-19.
Well, here's the perfect project: setting up your own "tilde club" along the lines of [tilde.club](http://tilde.club) or [tilde.town](http://tilde.town/) (see [here](http://tilde.club/~ejw/) for my tilde.club account).
There's something in this project for people of different interests and skill sets. 
My main interest was to gain some experience with setting up a web server and being a system admin of a UNIX-like system.
For my non-technical friends, it was a fun project because it provided a safe environment to get to learn the command line and learn how to write web pages.
As for the content of those web pages: your own fantasy is the limit.
Okay fair enough: your skill level is also a limit, but you can make fun wonky webpages with basic html and css.
Here's a quick write up of the steps to get you started.

## Boot up a Linux Virtual Machine in the cloud

Our server is hosted on Google Cloud Platform. 
They have an "always free" tier for which very specific restrictions apply both for the hardware and the location of the Virtual Machine (it has to be located in a specific part of the US). 
A virtual machine is basically a computer program that emulates a computer system on which you can run a particular operating system as if it were a regular computer as you have it at home.
In this quick guide I'm assuming you are running Linux.
Usually, providers offer readymade VMs with operating systems pre-installed, so you won't have to do this manually.

If you opt for the always free tier, your resources will be limited (580 Mb RAM). 
That's okay, in fact, it's a fun challenge in itself. 
It makes us think about how we use our shared computer and also introduces (hopefully) some sense of responsibility: you share the computer with other users and if you consume all resources they are left out.
580 Mb should be more than enough for your friends and for running a lightweight web server for hosting some web pages

For the setup instructions you'll need a user account with root privileges ("administrator rights", if you're coming from Windows).
You can make one from the start (skip ahead) or just use the web interface that the provider offers.

## Creating a server message of the day (MOTD)

When people login they are greeted with some information about the system and a welcome message.
You can customize this welcome screen entirely. 
Maybe come up with a nice logo for your server and display some useful instructions for new users.

To edit the message of the day, just edit the `/etc/motd` file, for example with nano or vim (so `vim /etc/motd`).
This is just a text file and everything you place in there will be printed verbatim to the welcome screen. 

There are also a number of scripts whose output is displayed.
You can list all of them with `ls /etc/update-motd.d`.
You'll see that there are several scripts sorted by a prependend number.
The number in the filename indicates its order of execution. 
For example, on Ubuntu you will find a script called `10-help-text` and another called `50-motd-news` and the first will be executed before the latter.
So if we then want a custom script to be run, before these scripts, we could create a bash script called `01-custom`.

For example, on login, I want to show which other users are online:

```
#!/bin/sh

echo "Who is logged in?\n"

users | tr ' ' \\n | uniq
```

You can enable or disable some of these scripts by toggling whether they are executable, so there is no need to delete these scripts if you do not want them to run.

To disable all scripts in this folder, run `sudo chmod -x /etc/update-motd.d/*`. 

`sudo` is to "do" this action with "super user (su)" rights, chmod changes the files permissions, and the `*` expands to all files in the folder.

To then enable your own script, instead run `sudo chmod+x /etc/update-motd.d/01-custom`.

## Creating user accounts

Now that we have a welcome message, we should add some users to our system.

Creating a new user is easy enough, you simple run:

`adduser [name]`, so for example `adduser edwin`, and then fill in the details in the prompt.

However, you'll likely want to have stuff ready for new users on their first login.
The `adduser` command reads a "skeleton" directory called `/etc/skel`. 
Everything you put in there will be copied to the home folder of the new user.

If you want to set your server up like a "tilde" club I can for example publish a website under `myurl/~edwin`, then it is handy to already provide a `public_html` folder with a default `index.html` file. 

You could also leave some further instructions for new users in a README file and provide some minimal configuration files, for example a `.vimrc` for Vim.

The first user we will make is our own admin account with sudo rights, so we can proceed using that account instead of the root user that the webinterface offers.
I'm assuming you already made your account with the command from above. 
Then set a password, and add your account to the "sudoers" group. 
Check all groups with `groups` to check if indeed there's a sudo group. 
Interestingly, on Google Cloud Platform the "sudo" group is replaced with a group called "google-sudoers".

Set the user's password: `passwd [name]`.

Add the user to the sudo group: `usermod -aG sudo edwin`.

## Giving users access over ssh

We do not have a graphical environment, so users will have to connect with a shell session on our server. 
We do that with a tool called `ssh` for secure shell.

For setting up ssh as a user, I can refer you to the [tilde.club tutorial on ssh](https://tilde.club/wiki/ssh.html).
The tricky part with ssh is to make sure all file permissions are correct.

On the server side, we need to ensure the "ssh daemon" (`sshd`) is running and that people can connect through the port we specified (22 by default).

Check the status of the ssh daemon: `systemctl status sshd`.

Open port 22 for ssh traffic: `sudo ufw allow 22` or `sudo ufw allow ssh`.

Enable the firewall: `sudo ufw enable`.

Before enabling the ssh daemon to allow incoming ssh connections, we should decide whether to allow people to login with their passwords or only using a ssh key. 
The latter is the more secure option and is strongly recommended, but requires more effort from users (again, see the tilde.club guide for ssh).
The sshd configuration can be found at `/etc/ssh/sshd_config`.
Google Cloud Platform already created this file for me with sensible defaults. 
If not, you should read a tutorial on this file because setting it up wrongly is likely to make your system vulnerable.

Assuming everything else is set up correctly, just choose whether you want to login with passwords or only with keys, by setting `PasswordAuthentication` to either "yes" or "no".

FYI, you can check information about shh login attempts in `/var/log/auth.log`.
E.g. run `grep ssh /var/log/auth.log | less`.

## Setting up a "usedir" web server with nginx

Now we'll allow our users to publish everything in their `public_html` under `[yourdomainurl]/~[user]`. The "~" is why these type of servers are now called "tilde" communities, and they indicate that you've reached a particular userspace on the shared domain.
You still see it sometimes for old school sites of academics, see for example this great page on [Prof. Dr. Style](http://contemporary-home-computing.org/prof-dr-style/).

We'll use Nginx because it is very lightweight and easy to setup.
This [guide from DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04) is great and straightforward.
It also instructs you to set up the firewall `ufw` correctly, like we did before for `ssh`.

Assuming you keep the default settings, you can edit your homepage with:
`vim /var/www/html/index.nginx-debian.html`

The next thing we want to do is set up nginx to publish web sites "usedir"-style, meaning that we allow each user to publish a website from a `public_html` folder in their home directory. 
I found [here](https://websiteforstudents.com/configure-nginx-userdir-feature-on-ubuntu-16-04-lts-servers/) how to do that in Nginx. 
Open the default configuration file at `/etc/nginx/sites-available/default` and make sure it matches the following:

```
# Default server configuration
#
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        # SSL configuration
        # listen 443 ssl default_server;
        # listen [::]:443 ssl default_server;

        root /var/www/html;

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;
        server_name example.com www.example.com;

         location ~ ^/~(.+?)(/.*)?$ {
         alias /home/$1/public_html$2;
         index index.html index.htm;
         autoindex on;
           }
}
```

These should be default except for the block starting with "location".

Now we just start or restart Nginx and everything should work!

`systemctl restart nginx`

All users can now make their own website, which will be live immediately. 

## Set your personal information to see for other users

Linux systems have this interestingly named tool called `finger` that shows you the personal information of other users, as well as their current plans and the project they are working on.

To set your own details, "change finger": `chfn`.

Additionally, you can notify others what you are up to by making a plan at `~/.plan`.

You can also indicate others of a project you are working on by making `~/.project`.

All this information will be included when people "finger" you.

Output of `finger ejw`:

```
Login: ejw                              Name: Edwin Wenin
Directory: /home/ejw                    Shell: /bin/bash
Office: Netherlands
On since Wed Feb 26 08:40 (MST) on pts/18 from 145.116.163.127
   3 seconds idle
No mail.
Project:
Experimenting with old school Unix stuff
Plan:
Think about fun projects to add to my page
```

Your ~/.plan file can be arbitrarily long, so this is basically the first blogging tool ever.
You could "finger" someone and read their latest "blogpost" there.

You can change your shell with `chsh`.

## Set the correct timezone

For example:
`timedatectl set-timezone Europe/Amsterdam`

## Communicating with others on the server

Now that people can login, we can try to communicate with other users. 

See who's online with `who`.

You can write to all, with `wall`. 
This will dump your message on the screen of all logged in users, interrupting their work.
This is fun or annoying, depending on who you ask and how often you do this.
Others can clear their screen and continue working with `Ctrl-l`.

You can also write to individual users, simple say `write [user]`.
It can occur that a user is logged in multiple times, in that case you need to be more specific, for example `write edwin pts/0`. 
You can find all that info under `who`.
Also handy to know: you quit writing a message, type `Ctrl-D`.

This does not allow us to write messages to people that are offline. 
For this however, we can use mail!

When you "finger" yourself, it will say "No mail". 
Let's change that.

Setting up mail can be a hassle, but using mail only locally luckily works out of the box.

Find out if a mail client is installed:

`dpkg -S /usr/sbin/sendmail`

Install the `postfix` MTC ( Mail Transfer Client).
This will spawn a prompt asking you how you want to use `postfix`. 
Indicate you only want to use it locally.

`sudo apt install postfix`

Luckily for us, postfix contains a default config for local use only.
Now we can send mail between users, great!

Use the `sendmail` command to send mail.
Local mail arrives in `/var/mail/[username]`

Now we need a way to read mail. 
For this we'll use `mutt`.

Install mutt: `sudo apt install mutt`

Then open your local mailbox with `mutt -f /var/mail/[username]`

Try sending yourself an email, and then finger yourself again to see if your "Mail" entry is updated.
Done!

If you want to make your club more social with instant messaging, consider installing an IRC daemon for IRC chat.

## Installing some fun commands

- sl
- tmatrix
- cowsay
- fortune
- fortune-mod
- figlet
- ansiweather

## Creating your own commands for your tilde community

Don't forget to have some fun making your own stuff for your little community.
In my friend group we have this quite random beaver theme going on. 
So I extended the `cowsay` command with an ASCII beaver ([source](https://www.asciiart.eu/animals/beavers)) and made it spit out random beaver-related quotes:

     ----------------------------------------
    < Save a tree, eat a beaver - Zac Hanson >
     ----------------------------------------
         \       .---.
          \     @ @   )   
           \    ^     |
                [|]    | ##
               /      |####
              (       |####      
               | /   |#BP#
              / |.'   |### 
             _ ``   )##
            /,,_/,,____#


If you place this command in `/usr/local/bin` and make it executable, other people can also use it.

Because all users are on the same machine, you can really create some community based content. 
For example, I asked my friends to put a `~/.digest` file in their home directory where they can give a daily tip for music, culture etc.
Then I made a script that reads those files and compiles them into a webpage with all daily tips.

Fun aside, your little community could probably use some handy scripts.
Another script I enjoyed making was one that finds the most recently updated web pages from all `public_html` directories. I then make a webpage out of those as well, so it's easy to keep track of what others are doing.
This might be one of the most convoluted oneliners I ever wrote, but it works:

```
find /home/ -path "*public_html*html" -type f -ls -printf "%T@ %p" | sort -k 1nr | head -n 15 | cut -d " " -f 2 | sed "s/\/home\///" | sed "s/\/public_html//"
```

You can automate the running of such a script using `crontab -e`.
By the way, once you have scheduled your script for timed repetition using `cron`, it just happens to be that the cron daemon sends you mail on the mail you have just configured!

## Conclusion

If you follow these steps and play around with them, you've created your own little corner of the internet. 
I'd like to think that's also a small form of resistance against the modern internet dominated by tech giants, bots and ads.
Besides, sometimes old and simple technology is just the coolest.
