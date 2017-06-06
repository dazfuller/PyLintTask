import tl = require('vsts-task-lib/task')
import tr = require('vsts-task-lib/toolrunner')
import path = require('path')

/**
 * Activates the virtual environment created at the provided location
 * @param venvPath The path to the virtual environment
 */
function activateVenv(venvPath: string) {
    tl.debug('Activating virtual environment')

    let venvToolsPath = isWindows() ? 'Scripts' : 'bin';

    process.env['VIRTUAL_ENV'] = venvPath;
    process.env['PATH'] = path.join(venvPath, venvToolsPath) + path.delimiter + process.env['PATH'];
}

/**
 * Determines if the current operating system is Windows based
 */
function isWindows() {
    return tl.osType().match(/^Win/) != null;
}

/**
 * Execute PyLint task
 */
async function executePyLint() {
    // Get the working directory and move to it
    let cwd = tl.getPathInput('cwd', true, true);
    tl.cd(cwd);

    // Create the virtual environment and switch into it if not already in one
    if (process.env['VIRTUAL_ENV'] == undefined) {
        tl.debug('Not currently in a virtual environment');

        var agentBuildDir = tl.getVariable('Agent.BuildDirectory');

        // Define the location of the virtual environment
        let venv = path.join(agentBuildDir, 'venv', 'build');
        tl.debug('Virtual environment path set to: ' + venv);

        // Create the virtual environment
        tl.debug('Creating virtual environment');
        let pythonPath = isWindows() ? tl.which('python') : tl.which('python3');
        let venvTool = tl.tool(pythonPath).arg(['-m', 'venv', venv]);
        await venvTool.exec();

        // Activate the virtual environment
        activateVenv(venv);
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
    console.log('Executing PyLint against: ' + cwd);

    let pyLintTool = tl.tool(tl.which('pylint')).arg(lintArgs);
    let pyLintToolOptions: tr.IExecSyncOptions = <any> {
        silent: true
    };
    
    let lintResults = pyLintTool.execSync(pyLintToolOptions);

    // Check if the output contains mentions of lint checker warnings
    if (lintResults.stdout.match(/\[[RCWEF]\d{4}.*\]/g)) {
        tl.setResult(tl.TaskResult.Failed, lintResults.stdout);
    } else {
        tl.setResult(tl.TaskResult.Succeeded, 'Successfully completed PyLint checks');
    }
}

/**
 * Task entry point
 */
async function run() {
    try {
        executePyLint();
    } catch (e) {
        tl.setResult(tl.TaskResult.Failed, e.message);
    }
}

run();