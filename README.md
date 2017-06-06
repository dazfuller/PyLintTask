# PyLintTask

A [VSTS](https://www.visualstudio.com/team-services/) build task for running PyLint against a code base. It does this by creating a virtual environment and installing PyLint within that before executing.

This is a first attempt for me to create a VSTS build task and is in early stage development.  The current roadmap for the task is as follows:

1. Initial version to simply create a virtual environment and execute PyLint [*Done*]
1. Initialization of virtual environment based on pip freeze file, installing PyLint if not already available [*Done*]
1. Exposure of PyLint command line options
1. Ability to specify more than just modules

And also at some point during the development ensuring that the task is available cross-platform, currently it will only work on Windows based build agents as hosted Linux agents require installation of additional packages (python-venv).