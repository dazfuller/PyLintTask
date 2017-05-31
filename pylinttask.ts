import tl = require('vsts-task-lib/task')
import tr = require('vsts-task-lib/toolrunner')
import path = require('path')

function activateVenv(venvPath: string, isWindows: boolean) {
    tl.debug('Activating virtual environment')

    var venvToolsPath: string;
    var pathSeperator: string;

    if (isWindows) {
        venvToolsPath = 'Scripts';
        pathSeperator = ';';
    } else {
        venvToolsPath = 'bin';
        pathSeperator = ':';
    }

    process.env['VIRTUAL_ENV'] = venvPath;
    process.env['PATH'] = path.join(venvPath, venvToolsPath) + pathSeperator + process.env['PATH'];
}

async function run() {
    // Get the working directory and move to it
    let cwd = tl.getPathInput('cwd', true, true);
    tl.cd(cwd);

    // Create the virtual environment and switch into it if not already in one
    if (process.env['VIRTUAL_ENV'] == undefined) {
        tl.debug('Not currently in a virtual environment');

        // Determine if this is a windows based environment
        let isWindows = tl.osType().match(/^Win/) != null;

        // Define the location of the virtual environment
        let venv = path.join(cwd, 'venv', 'build');
        tl.debug('Virtual environment path set to: ' + venv);

        // Create the virtual environment
        tl.debug('Creating virtual environment');
        var pythonPath: string;
        if (isWindows) {
            pythonPath = tl.which('python');
        } else {
            pythonPath = tl.which('python3');
        }
        let venvTool = tl.tool(pythonPath).arg(['-m', 'venv', venv]);
        await venvTool.exec();

        // Activate the virtual environment
        activateVenv(venv, isWindows);
    } else {
        tl.debug('Already in a virtual environment');
    }

    // Install PyLint
    tl.debug('Installing PyLint into virtual environment');
    let pipTool = tl.tool(tl.which('pip')).arg(['install', 'pylint']);
    await pipTool.exec();

    // Get the collection of modules to check
    let modules = tl.getDelimitedInput('modules', ' ', true);
    let lintArgs = ['-f', 'msvs'].concat(modules)

    // Execute PyLint
    tl.debug('Executing PyLint against modules: ' + modules);
    console.log('Executing PyLint');
    let pyLintTool = tl.tool(tl.which('pylint')).arg(lintArgs);
    let pyLintToolOptions: tr.IExecSyncOptions = <any> {
        silent: true
    };
    let lintResults = pyLintTool.execSync(pyLintToolOptions);

    if (lintResults.stdout == undefined) {
        tl.setResult(tl.TaskResult.Succeeded, '');
    } else {
        console.log(lintResults.stdout);
        tl.setResult(tl.TaskResult.Failed, 'Failed PyLint checks');
    }
}

run();