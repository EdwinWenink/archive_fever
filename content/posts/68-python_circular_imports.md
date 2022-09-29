---
title: "On circular imports in Python"
date: 2022-09-24T14:00:45+02:00
draft: false
author: "Edwin Wenink"
tags: ['python', 'programming']
series: ['programming']
---

It has happened in the past that I've been sloppy with programming and took some shortcuts just to "get things done," and that I encountered an error like the following: `AttributeError: module 'X' has no attribute 'call'`.
This was quite baffling because module X *did* have the attribute `call`.
It turned out that I had accidentally did a very bad thing, namely to use a circular import that caused a function call to module X before that function was properly defined.
I knew I messed up, but in this post I dive deeper into *how* I messed up.

## Example

Let's say we have a module X importing module Y:

```python
# module X
import Y

print("Name:", __name__)
print("X start")


def call():
    print("You are calling a function of module X.")


if __name__ == '__main__':
    print("X main")
```

When we call this script, we call the `import Y` statement first, which executes the code in module `Y`.
Now let's define module `Y` with a circular import:

```python
# module Y
import X

print("Name:", __name__)
print("Y start")

X.call()


def call():
    print("You are calling a function of module Y.")


if __name__ == '__main__':
    print("Y main")
```

Now if we open an interactive terminal and import X, we run into trouble:

```python
>>> import X
Name: Y
Y start
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "C:\Users\Edwin Wenink\Documents\programming-practice\Python\circular_import\X.py", line 2, in <module>
    import Y
  File "C:\Users\Edwin Wenink\Documents\programming-practice\Python\circular_import\Y.py", line 6, in <module>
    X.call()
AttributeError: module 'X' has no attribute 'call'
```


This is what happens:

1. We import module X
2. The first line of module X import Y
3. This executes the code in module Y
4. Python sees X is already (partially being) imported, so the `import X` statement in `Y` will not trigger compilation of the content of X.
4. This will print  "Name: Y" and "Y start"
5. Then it will run `X.call()`
6. But the `def call()` statement in module `X` has not been run yet, so we run into this error!

## Understanding the problem

A possible solution could be to run `import Y` only *after* declaring the functions that are needed by module `Y`.
If we do this, we get the following output without error:

```python
>>> import X
X start
Y start
You are calling a function of module X.
```

Note that importing Y with the above code gives no problems because X is defined before `X.call()` runs, but *only* because in this toy example X does currently not use the imported module Y:

```python
>>> import Y
Name: X
X start
Name: Y
Y start
You are calling a function of module X.
```

In both cases, we see that the main function does not run because neither module is invoked as the main module.
The current situation is that importing X throws an error, but importing Y does not.
When *directly invoking* the scripts as the main module, we see the opposite!
Calling X:

```python
> python X.py
Name: X
X start
Name: Y
Y start
You are calling a function of module X.
Name: __main__
X start
X main
```

It took me a bit to understand why this does work now.
The difference is that now we do not start our execution with an `import X` statement, so that in the first line of `Y.py` the `import X` line actually triggers a full run over `X`.
This means that `X.call()` is defined after all before it's called in `Y`!
Another detail we notice now is that `Y` calls the module X; but when the executing of the main file continues, we are running the `__main__` object.

Now let's see what happens when calling Y as the main function:

```python
> python Y.py
Name: Y
Y start
Traceback (most recent call last):
  File "Y.py", line 2, in <module>
    import X
  File "C:\Users\Edwin Wenink\Documents\programming-practice\Python\circular_import\X.py", line 2, in <module>
    import Y
  File "C:\Users\Edwin Wenink\Documents\programming-practice\Python\circular_import\Y.py", line 6, in <module>
    X.call()
AttributeError: module 'X' has no attribute 'call'
```

Now, executing `Y` triggers `import X`.
This in turn, will trigger `import Y`.
Because `Y` is not in the list of modules yet (we haven't run `import Y`), Y will be compiled and we'll encounter `X.call()` before this function is defined.

Things get even more complicated when `Y` is also called from `X`.
Even when you can postpone some imports to quickly fix the situation, it's better to avoid this situation altogether by refactoring your code.
Otherwise, your code will break if a colleague wonders why there's an import statement at the bottom of the file and moves it up.

TLDR; *avoid circular imports!*
