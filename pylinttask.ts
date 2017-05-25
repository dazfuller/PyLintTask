import tl = require('vsts-task-lib/task')
import tr = require('vsts-task-lib/toolrunner')
import path = require('path')

async function run() {
    // Get the working directory and move to it
    let cwd = tl.getPathInput('cwd', true, true);
    tl.cd(cwd)

    // Create the virtual environment and switch into it if not already in one
    if (process.env['VIRTUAL_ENV'] == undefined) {
        // Define the location of the virtual environment
        let venv = path.join(cwd, 'venv', 'build');

        // Create the virtual environment
        let venvTool = tl.tool(tl.which('python3')).arg(['-m', 'venv', venv]);
        await venvTool.exec();

        // Activate the virtual environment
        process.env['VIRTUAL_ENV'] = venv;
        process.env['PATH'] = venv + '/bin:' + process.env['PATH'];
    } else {
        console.log('Already in a virtual environment');
    }

    // Install PyLint
    let pipTool = tl.tool(tl.which('pip')).arg(['install', 'pylint']);
    await pipTool.exec();

    // Get the collection of modules to check
    let modules = tl.getDelimitedInput('modules', ' ', true);

    // Execute PyLint
    let pyLintTool = tl.tool(tl.which('pylint')).arg(modules);
    await pyLintTool.exec();
}

run();