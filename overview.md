# PyLint Build Task

A task to run PyLint against a [Python](https://python.org) 3 code base, the equivalent of running:

```bash
$ pylint -f msvs <modules>
```

The task takes 4 parameters, the main ones being:

* Root directory - This is location within the code base for where the code base can be located, if it is not specified then it is assumed that the root of the source code is the location to work from.
* Pip requirements - The *optional* path to a Pip requirements file enabling additional modules to be restored
* Modules - The list of modules to execute PyLint against

The task does not create any HTML output but will return the results of a failed check from the task so that they can be inspected in the build information.

## Requirements

Python 3 must be installed and be available in the PATH.

Whilst not tested specifically against Linux build agents, if you would like to try then you might also need to install the package appropriate for your distribution to make the venv module available.

If using the hosted build agents then you will need to check that you are using one which has Python 3 available (Hosted VS2017 for instance).

## Releases

Version | Description
------- | -----------
1.0.x   | Initial release targetting the execution of PyLint on Windows build agents
