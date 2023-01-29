---
title: "Version control on notebooks using pre-commit and jupytext"
date: 2023-01-29T16:21:46+01:00
draft: false
author: "Edwin Wenink"
toc: true
tags: ['programming', 'python']
---

Notebooks have a place and a time.
They are suitable for sharing the insights of an exploratory data analysis, but not so convenient for collaborating with multiple people whilst having the notebook code under version control.
Generally speaking notebooks do not promote good coding habits, for example because people tend to duplicate code by copying cells.
People typically also don't use supportive tooling such as code linters and type checkers.
But one of the most nasty problems with notebooks is that version control is hard, for several reasons.
Running a diff on notebooks simply sucks.
The piece of text we care about when reviewing - the code - is hidden in a JSON-style data structure that is interleaved with base-64 encoded blobs for images or binary cell outputs.
Particularly these blobs will clutter up your diffs and make it very hard to review code.
So how can we use notebooks with standard versioning tools such as Git?
This post explains an automated workflow for good version control on Jupyter and Jupyter Lab notebooks using Git, the pre-commit framework, and Jupytext.
The final pre-commit configuration can be found <a href='#putting-it-all-together'>here</a>.

## Which type of notebooks need a version control workflow?

But let's first take a step back.
Whether we actually need version control depends on what the purpose of the notebook is.
We can roughly distinguish two types of notebooks.

Firstly, we have exploratory notebooks that can be used for experimentation, early development, and exploration.
This type of notebook should be treated as a historical and dated (possibly outdated!) record of some analysis that provided insights at some moment in a project.
In this sense the notebook code does not have to be up to date with the latest changes.
For this type of "lab" notebook, most difficulties concerning version control can be avoided by following these recommendations:

- Exploratory notebooks should have a *single* author who is the owner of the analysis
- A minimal version control approach is possible: others do not push changes in that notebook, unless explicitly coordinated with the owner of the notebook.
    * This should avoid having to review unreadable diffs
    * And also avoid merge conflicts altogether
- Mention the *date* and the *author name* of the analysis in the file name to make the historical character and owner explicit

Secondly, in some workflows one may want to collaborate with multiple people on the same notebook or even have notebooks in production (looking at you, Databricks).
In these cases, notebooks store the most up-to-date and polished up output of some analysis that can be presented to stakeholders.
But the most notable difference is that this type of notebook is the responsibility of the *whole* data science team.
As a result, the notebook workflow should support more advanced version control, such as the code review process via pull requests and handling merge conflicts.
The rest of this post explains such a workflow.

## General recommendations

To start, I make these general recommendations for all notebooks that are committed to a Git repository:

1. Clear all cell outputs before committing a notebook to the repository
    * This avoids cluttering Git diffs with anything other than code, although this will not prevent changes in metadata to be pushed.
    * If notebook output has to be put under version control, convert the notebook to html (using "save as" or `nbconvert`) and commit the html instead.
2. Store notebooks apart from the main source code of a project. I personally use a dedicated `notebooks` folder.
    * This also allows you to more easily trigger a separate workflow for notebooks (see below).
    * This keeps the main source code of a project uncluttered with dated notebooks.

## Motivation of the chose workflow

The core idea of this workflow is to *convert* notebooks to regular scripts and use these to create meaningful diffs for reviewing.
This basic workflow *could* work something like this:

- When you need to diff a notebook, export to Python using `jupyter nbconvert` and diff the Python file instead.
- When you need output, use `nbconvert` to execute the notebook and convert the output to html
- Before committing a notebook, clear the outputs to minimize unreadable blobs

To convert to HTML: `jupyter nbconvert /notebooks/example.ipnb --output-dir="/results" --output="example.html"`.

To convert to Python: `jupyter nbconvert /notebooks/example.ipnb --to="python" --output-dir="/results" --output="example"` or the newer syntax `jupyter nbconvert --to script notebook.ipynb`.
Notice the absence of the `.py` extension if you specify a `to` argument.
Multiple notebooks can be converted using a wildcard.

If you want to have executed notebooks in your production environment, you can 1) commit the Python version of the notebook and 2) execute the notebook with a call to `nbconvert` in a pipeline, such as Github Actions ([example GitHub Actions workflow](https://github.com/dliden-bitdotio/bls-notebook)).
This allows you to execute a notebook without opening the notebook in your browser.
You execute a notebook with cleared outputs as such:

`jupyter nbconvert --to notebook --execute notebook_cleared.ipynb --output notebook_executed`

However, a downside of `nbconvert` is that the conversion is uni-directional from notebook to script, so one cannot reconstruct the notebook after making changes in the generated script.
In other words, the corresponding script would be used strictly for reviewing purposes, but the notebook would stay the single source of truth.
The `jupytext` tool solves this problem by doing a bi-directional synchronization between a notebook and its corresponding script.

We should also note that this workflow requires several *manual* steps that can be easily forgotten and messed up.
It is possible to write post-save Jupyter hooks to automate these steps, but a limitation is that such a configuration would be user-specific.
It is also possible to use Git hooks, but these are project-specific and would require all team members to copy in the correct scripts in a project's `.git` folder.
Instead, we'd like to describe a workflow that can be installed in a new project in a uniform manner, such that each team member is guaranteed to use the same workflow.
We'll use the multi-language `pre-commit` framework to install a `jupytext` synchronization hook.

## What is Jupytext?

Jupytext is a tool for two-way synchronization between a Jupyter notebook and a paired script in [many languages](https://jupytext.readthedocs.io/en/latest/languages.html).
In this post we only consider the `.ipynb` and `.py` extensions.
It can be used as a standalone command line tool or as a plugin for Jupyter Notebooks or Jupyter Lab.
To save information on notebook cells jupytext either uses a minimalistic "light" encoding or a "percent" encoding (the default).
We will use the percent encoding.
The following subsections are applicable only if you want to be able to use jupytext as a standalone tool.
If not, skip ahead to <a href="#version-control-using-pre-commit-and-jupytext">here</a>.

### Installation and pairing

- Install as standalone command using pip
    * `pip install jupytext --upgrade`
    * Handy! Can be included in requirements.txt
- Install as Jupyter notebook extension
    * `jupyter nbextension install --py jupytext [--user]`
    * Follow by: `jupyter nbextension enable --py jupytext [--user]`
    * Notebook: File -> Jupytext -> Pair Notebook with light (fewer markers) or percent (explicit cell delimiters) script
    * If you now save the notebook, a corresponding .py version will be updated automatically!
- Install as Jupyter lab extension
    * `jupyter labextension install jupyterlab-jupytext`
    * Lab: View -> Activate Command Palette (Ctrl+Shift+C) -> Pair Notebook with ...
    * If you now save the notebook, a corresponding .py version will be updated automatically!

### Basic usage

When you save a paired notebook in Jupyter, both the `.ipynb` file and the script version are updated on disk.

On the command line, you can update paired notebooks using `jupytext --sync notebook.ipynb` or `jupytext --sync notebook.py`.
If you run this on a new script, `jupytext` will encode the script and define cells using some basic rules (e.g. delimited by newlines), then convert it to a paired notebook.

When a paired notebook is opened or reloaded in Jupyter, the input cells are loaded from the text file, and combined with the output cells from the `.ipynb` file.
This also means that when you edit the `.py` file, you can update the notebook simply by *reloading* it.

You can specify a project specific configuration in `jupytext.toml`:

```
formats = "ipnb,py:percent"
```

To convert a notebook to a notebook *without outputs*, use `jupytext --to notebook notebook.py `.

## Version control using pre-commit and Jupytext

Okay, so jupytext handles the two-way synchronization between scripts and outputs, which is an improvement compared to Jupyter's native `nbconvert` command.
The basic idea is still that when you want notebook code reviewed, collaborators can instead read and comment on the paired script.
It is now also possible to incorporate the feedback directly in the script if we wish to do so, because the notebook will be updated accordingly.

Our broader goal was to completely remove any need for manual steps.
We will automate the synchronization step using a pre-commit hook, which means that we check the synchronization status before allowing work to be committed.
This is a safeguard to avoid to avoid that out of sync notebooks and scripts are committed.

Git hooks are very handy, but they go in `.git/hooks` and are therefore not easily shared across projects.
The `pre-commit` package is designed as a multi-language package manager for pre-commit hooks and can be installed using pip: `pip install pre-commit`.
It allows you to specify pre-commit hooks in a declarative style and also manages dependencies, so if we declare a hook that uses jupytext we do not even have to manually install jupytext.
We declare the hooks in a configuration file.
We also automate the "clear output cells" step mentioned above using `nbstripout`.

My `.pre-commit-config.yaml` for syncing notebooks and their script version looks like this:

```
repos:
-   repo: https://github.com/kynan/nbstripout
    rev: 0.6.1
    hooks:
    -   id: nbstripout
-   repo: https://github.com/mwouts/jupytext
    rev: v1.14.1
    hooks:
      - id: jupytext
        name: jupytext
        description: Runs jupytext on all notebooks and paired files
        language: python
        entry: jupytext --pre-commit-mode --set-formats "ipynb,py:percent"
        require_serial: true
        types_or: [jupyter, python]
        files: ^notebooks/  # Only apply this under notebooks/
```

After setting up a config, you have to *install* the hook as a git hook: `pre-commit install`.
This clones jupytext and sets up the git hook using it.
Now the defined commit wil run when you `git commit` and you have defined the hook in a language agnostic way!
In this configuration, you manually specify the `rev` which is the tag of the specifiek `repo` to clone from.
You can test if the hook runs by running it on a specific file or on all files with `pre-commit run --all-files`.

### Explanation and possible issues

There are some important details when using Jupytext as a pre-commit hook.
The first *gotcha* is that when checking whether paired notebooks and scripts are in sync, it actually runs jupytext and synchronizes paired scripts and notebooks.
If the paired notebooks and scripts were out of sync, running the hook will thus *introduce unstaged changes*!
These unstaged changes also need to be committed in Git before the hook passes and it is recognized that the files are in sync.

The second gotcha is that the `--pre-commit-mode` flag is important to avoid a subtle but very nasty loop.
The standard behavior of `jupytext --sync` is to see which two of the paired files (notebook or script) was most recently edited and has to be taken as the ground truth for the two way synchronization.
This is problematic because this causes a loop when used in the pre-commit framework.
For example, let's say that we have a paired notebook and script and that we edit the script.
When we commit the changes in the script, the pre-commit hook will first run jupytext.
In this case the script is the "source of truth" for the synchronization such that the notebook needs to be updated.
The jupytext pre-commit check will fail because we now have unstaged changed in the updated notebook that we need to commit to Git.
When we commit the changes in the updated notebook, however, the notebook becomes the most recently edited file, such that jupytext complains that it is now unclear whether the notebook or the script is the source of truth.

The good news is that jupytext is smart enough to raise an error and requires you to manually specify which changes to keep.
The bad news is that in this specific case, this manual action does not prevent the loop: we're in a Catch 22 of sorts!
The `--pre-commit-mode` fixes this nasty issue by making sure that jupytext does not always consider the most recently edited file as the ground truth.

Within the pre-commit framework you almost certainly also want to specify other hooks.
For example, I want to make sure my code is `PEP8` compliant by running `flake8` or some other linter on the changes that are to be committed.
The pre-commit framework itself also offers hooks for fixing common code issues such as trailing whitespaces or left-over merge conflict markers.
But this is where I've encountered another nasty issue that prevented the jupytext hook from correctly syncing.

Let's take a hook that removes trailing white spaces as an example.
This hook works as intended on Python scripts, but the hook does not actually remove trailing white spaces *in the code* because source code of notebook cells are encapsulated in a JSON field as follows:

```
{
 "cell_type": "code",
 "execution_count": null,
 "id": "361b20cc",
 "metadata": {
  "gather": {
   "logged": 1671533986727
  },
  "jupyter": {
   "outputs_hidden": false,
   "source_hidden": false
  },
  "nteract": {
   "transient": {
    "deleting": false
   }
  }
 },
 "outputs": [],
 "source": [
  "#### pre-processing\n",
  "from src.preprocessing import preprocess_and_split\n",
  "\n",
  "df_indirect, df_direct, df_total = preprocess_and_split(df)"
 ]
}
```

This means that if you commit a notebook with trailing white spaces in the cells, the following happens and will prevent the paired notebook and script from ever syncing:

- The jupytext hook synchronizes the notebook with a paired Python script.
- Trailing whitespaces are removed from the Python script and the *plain text* representation of the notebook (i.e. it removes trailing white space after the closing brackets)
- When translating the notebook to code or vice versa, one version still includes trailing white spaces in the code cells and the other not.

This is something to be wary of and needs to be solved on a case to case basis.
I have solved this specific issue by adding all notebooks in the `notebooks` folder as per my recommendation and then not running the trailing whitespace hook in the `notebooks` folder.

## Putting it all together

The following is a `.pre-commit-config.yaml` that synchronizes all notebooks with Python scripts under `notebooks` and plays nice with other pre-commit hooks:

```
# Install the pre-commit hooks below with
# 'pre-commit install'

# Run the hooks on all files with
# 'pre-commit run --all'

repos:
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    # See: https://pre-commit.com/hooks.html
    hooks:
    -   id: trailing-whitespace
        types: [python]
        exclude: ^notebooks/  # Avoids Jupytext sync problems
    -   id: end-of-file-fixer
    -   id: check-merge-conflict
    -   id: check-added-large-files
        args: ['--maxkb=5000']
    -   id: end-of-file-fixer
    -   id: mixed-line-ending
    # Run flake8. Give warnings, but do not reject commits
-   repo: https://github.com/PyCQA/flake8
    rev: 6.0.0
    hooks:
    -   id: flake8
        args: [--exit-zero]  # Do not reject commit because of linting
        verbose: true
    # Enforce that notebooks outputs are cleared
-   repo: https://github.com/kynan/nbstripout
    rev: 0.6.1
    hooks:
    -   id: nbstripout
    # Synchronize notebooks and paired script versions
-   repo: https://github.com/mwouts/jupytext
    rev: v1.14.1
    hooks:
      - id: jupytext
        name: jupytext
        description: Runs jupytext on all notebooks and paired files
        language: python
        entry: jupytext --pre-commit-mode --set-formats "ipynb,py:percent"
        require_serial: true
        types_or: [jupyter, python]
        files: ^notebooks/  # Only apply this under notebooks/
```

The final workflow for version control on notebooks is as follows:

- Install Git pre-commit hooks in your project based on the declarative config using `pre-commit install`.
- Save notebooks under the `notebooks` folder
- Work on your Jupyter notebooks as usual
- Commit your work. This triggers the pre-commit hook
- If the pre-commit hook fails and introduces new changes, commit those changes too for the hook checks to pass
- Now all checks should pass and you are free to commit and push!
- When you make a PR, collaborators can now provide comments on the paired script
- Feedback can be incorporated either in the notebook or the script since they are synchronized anyways

Here we have assumed you have created and specified `.pre-commit-config.yaml` and `jupytext.toml` in your project root.

## Further reading

- [Jupytext docs](https://jupytext.readthedocs.io/en/latest/index.html)
- [Jupytext docs on collaborating on notebooks](https://jupytext.readthedocs.io/en/latest/examples.html).
- There are some notebook aware tools for diffing and merging
    * E.g. `nbdiff` and `nbmerge` commands from [nbdime](https://nbdime.readthedocs.io/en/latest/)
    * ReviewNB GitHub app
    * Neptune
- https://www.svds.com/jupyter-notebook-best-practices-for-data-science/
- http://timstaley.co.uk/posts/making-git-and-jupyter-notebooks-play-nice/
- https://innerjoin.bit.io/automate-jupyter-notebooks-on-github-9d988ecf96a6
- https://nextjournal.com/schmudde/how-to-version-control-jupyter
