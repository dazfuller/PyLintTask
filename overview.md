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

## Releases

Version | Description
------- | -----------
1.0.x   | Initial release targetting the execution of PyLint on Windows build agents
