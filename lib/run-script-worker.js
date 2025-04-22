'use strict';

const { parentPort } = require('worker_threads');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

parentPort.on('message', async ({ args = [], cwd }) => {
  let filePathCommande = `${path.join(__dirname, `../scripts/run.sh`)}`;

  if (!(await fs.existsSync(filePathCommande))) {
    parentPort.postMessage({ error: 'File does not exist: ' + filePathCommande });
    return;
  }

  const child = spawn(filePathCommande, args, { cwd });

  let output = '';
  let errorOutput = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
    parentPort.postMessage({ stream: 'stdout', data: data.toString() });
  });

  child.stderr.on('data', (data) => {
    errorOutput += data.toString();
    parentPort.postMessage({ stream: 'stderr', data: data.toString() });
  });

  child.on('close', (code) => {
    if (code !== 0) {
      parentPort.postMessage({
        error: `Command execution failed with code: ${code}`,
        stdout: output,
        stderr: errorOutput
      });
      process.exit(1); // Ensure worker exits with error code
    } else {
      parentPort.postMessage({
        success: true,
        stdout: output,
        stderr: errorOutput
      });
      process.exit(0); // Ensure worker exits cleanly
    }
  });
});