import tl = require('vsts-task-lib/task')
import tr = require('vsts-task-lib/toolrunner')

async function run() {
    // Determine if we are in a virtual environment by checking $VIRTUAL_ENV
    //   If not then create the virtual environment
    //   Do we need to restore from requirements.txt ?
    // Get list of modules to check from working directory
    // Execute PyLint
    let virtualEnv = process.env["VIRTUAL_ENV"];
    if (virtualEnv == undefined) {
        let pythonPath = tl.which('python');
        let tool = tl.tool(pythonPath).arg(['-m', 'venv', './venv/build'])
        await tool.exec();
    } else {
        console.log('Already in a virtual environment')
    }
}

run();