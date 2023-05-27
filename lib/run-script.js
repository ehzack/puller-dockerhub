'use strict';

const path = require('path');
const { spawn } = require('child_process');
const scripts = require('../scripts');
const fs = require('fs');
module.exports = async ({ repo_name, args = [], cwd = process.cwd() }) => {
  let filePathCommande = `${path.join(
    __dirname,
    `../scripts/${scripts[repo_name]}`,
  )}`;
  console.log(
    `Executing command ${filePathCommande} in ${cwd} with arguments:`,
  );
  args.forEach((arg) => console.log(`\t${arg}`));

  if (!(await fs.existsSync(filePathCommande)))
    throw new Error('File  does not exist: ' + filePathCommande);
  return new Promise((resolve, reject) => {
    const child = spawn(filePathCommande, args, { cwd });

    // child.stdout.on('data', (data) => {
    //   console.info(`stdout: ${data}`);
    // });

    // child.stderr.on('data', (data) => {
    //   console.info(`stderr: ${data}`);
    // });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`Command execution failed with code: ${code}`);
        reject(code);
      } else {
        console.info(`Command execution completed with code: ${code}`);
        resolve();
      }
    });
  });
};
