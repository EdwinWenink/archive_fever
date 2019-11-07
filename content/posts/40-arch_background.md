---
title: Pick a random background on each boot (Linux)
date: 2019-11-06
author: Edwin Wenink
tags: [arch, linux]
---

LightDM is a display manager that requires a "greeter" that prompts a user for credentials and lets a user log in to a session.
On my Arch system I currently use the LightDM GTK greeter. 
You can specify a background of your choice for the greeter if you think a black screen is a bit too boring.
Some people also think that just having *one* background is too boring.
This quick write-up shows how you can pick a different background each time you boot up your system.
If you do not use LightDM, you can easily adapt the instructions in this post to your needs.
I will discuss two different scenarios.

### Scenario 1: Static Greeter background, random thereafter

It could be the case that you want your LightDM greeter background to be static because you have a background that really suits the greeter, while at the same time you would like a random background after logging in. 
To achieve this, firstly specify the static background in the configuration file of your greeter at `/etc/lightdm/lightdm-gtk-greeter.conf`.

My configuration file looks like this:

```
[greeter]
theme-name = Adwaita-dark
icon-theme-name = HighContrast
position = 16%,center 40%,center
screensaver-timeout = 50
background = /usr/share/pixmaps/background.jpg
default-user-image = /usr/share/pixmaps/xterm-color_48x48.xpm
user-background = true
```

As you can see, you can set the background for the greeter here. 
There is a small catch: it is easiest if you place your background in `/usr/share/pixmaps`, because that location is readable by LightDM.
This way you do not have to worry about permissions.

Secondly, you can use `feh` to generate a random background from a folder of backgrounds.
In this scenario, the order of things is important. 
We use the LightDM greeter settings to set the background of the greeter, but then we want to change the background *before* starting up our window manager of choice (i3 or dwm in my case).
We can achieve this by calling `feh` from `~/.xprofile`, because LightDM sources `~/.xprofile` *before* starting the window manager.
Calling `feh` from `~/.xinitrc` did not work for me in combination with LightDM, because then LightDM overwrites the background you set at the beginning of the X session.

So simply make `~/.xprofile` if you do not have it yet, and enter the command `feh --randomize --bg-fill ~/Pictures/backgrounds/*`. 
This command assumes your backgrounds are stored in `~/Pictures/backgrounds/`, so adjust this as needed.

Notice that that command creates a file called `~/.fehbg` with your background settings.

If you do not use LightDM at all, you can use this method all the same to set a random background for your window manager, skipping the first step.

### Scenario 2: random LightDM background.

If you want the background of both the LightDM greeter and your window manager to be chosen randomly at startup, we can write a script to replace `background.jpg` in `/usr/share/pixmaps/` with a random background.
Alternatively, you could write a script to directly write to the greeter configuration file, but my approach is easier and has low risk, because you do not adjust any configuration file.

If you run `ls -l /usr/share/pixmaps/ | grep background.jpg`, you'll see that the background file is owned by the root user by default.
If you want to run a script to change the background file as a regular user, you need to make sure to give write access to the background file. 
One way to do that is by making your user the owner of the background file as such:

`sudo chown -R edwin:users /usr/share/pixmaps/background.jpg`

Where `edwin` is my username (run `whoami` to retrieve it), and `users` is the group name of regular users. 

After doing this, running the `ls` command from above gives the following output:

`-rw-r--r-- 1 edwin users 819492 Apr  3  2018 background.jpg`

Now we can write a script to pick a random background picture from the directory where we keep our backgrounds, and replace `background.jpg` with that new background.
I wrote a simple bash script for this:

```bash
#!/bin/bash

cd /usr/share/pixmaps

background_home=/home/edwin/Pictures/backgrounds

# Shuffle backgrounds and pick one
background=$(ls $background_home | shuf -n 1)

# Replace current LightDM greeter background
cp $background_home/$background background.jpg
```

Don't forget to run `chmod +x` on your script to make it executable.
Now all we need to do is call this script at the right place and time.

We simply call the script from `~/.xprofile` like we did before.
Replace the line we added for scenario 1 with a simple call to your script. 

Voila!
Each time you boot up your system you'll be greeted by a new background.
The background sticks around when you start up your window manager, unless you explicitly override it, like we did in scenario 1 with `feh`.

### Scenario 3: Change background at interval

If you want to keep changing your background picture with some time interval after you have logged in, you could adjust the bash script above to include a loop that updates the background for example each hour using `feh`. 

The adjusted bash script could look like this:

```bash
#!/bin/bash

cd /usr/share/pixmaps

background_home=/home/edwin/Pictures/backgrounds

# Shuffle backgrounds and pick one
background=$(ls $background_home | shuf -n 1)

# Replace current LightDM greeter background
cp $background_home/$background background.jpg

sleep 1h
# Use feh to ad hoc set a new random background at a given time interval
while :
do
	feh --randomize --bg-fill /home/edwin/Pictures/backgrounds/*
	sleep 1h
done
```

Because we now introduced an infinite loop, we should really make sure that the bash process can run in the background, otherwise your system will hang and never boot into your window manager!
This is not hard though. 
In your `~/.xprofile`, just make sure to disown the bash call, for example as such:

`random_background.sh & disown`

Now you will have a fresh background from your collection each hour! 
If you manage to hang your system anyways, just open another TTY and log in there to fix the problem. 
Because you do not automatically start the X server at other TTYs, you can adjust your script and halt the blocking process (e.g. using `htop`).
