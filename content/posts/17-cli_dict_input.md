---
author: "Edwin Wenink"
title: "Selecting user commands in style (Python)"
date: 2018-12-19
draft: false
tags: [Programming, Python, Dictionary, CLI]
---

If you write an interactive program that takes user commands as an input, you can select the appropriate action for a given command by going through a sequence of `if... else if` statements. 
But if you write in Python, there's always a cooler way to do things. A method I like personally in this situation is defining a dictionary where the keys are the command strings, and the corresponding values are lambda expressions. 
In the following definition, all commands are called with `command[cmd](args)`.
By passing a command string to the dictionary as a key, the lambda expression corresponding to that command key is selected. 
But in order to be fully applied, the lambda function still required an argument, which we can simply pass behind the call to the dictionary.
Although this method is maybe not more efficient... I would say it wins when scored on style.

```python
def read_cmd(input):
    inputs = input.split()
    cmd = inputs[0]
    args = inputs[1:]

    command = {
            "help": lambda x: help_message(),
            "poem": lambda x: say_poem_for(x[0]),
            "say": lambda x: banner_say(" ".join(x)),
            "exit": lambda x: banner_say("Bye cruel world!")
            }
    try:
        command[cmd](args)
    except:
        print("""
        '%s' was an example of an incorrect command
        """ % input)


# Fabricate some fake user inputs for testing
user_inputs = ["help", "Incorrect command", "say Welcome to the mean poem machine", "poem reader", "exit"]

for user_input in user_inputs:
    read_cmd(user_input)
```

To run the code for yourself, you could use these silly functions.
Run them in Python 3.

```python
def help_message():
    print("""
        help        see this menu, obviously
        say         say some text placed in a ascii banner
        poem        say a little poem for your muse
        exit        say bye!
        """)


def banner_say(message):
    print("""
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    %s
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    """ % message)


def say_poem_for(muse):
    print("""
        Dear %s,

        Roses are not blue
        Violets are not red
        Whatever you do
        It trumps being dead
        """ % muse)
```

Which together produces the following output:


        help        see this menu, obviously
        say         say some text placed in a ascii banner
        poem        say a little poem for your muse
        exit        say bye!
        

        'Incorrect command' was an example of an incorrect command
        

    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    Welcome to the mean poem machine
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    

        Dear reader,

        Roses are not blue
        Violets are not red
        Whatever you do
        It trumps being dead
        

    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    Bye cruel world!
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
