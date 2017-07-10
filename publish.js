/* eslint-disable no-console */

const exec = require('child_process').exec;
const Fs = require('fs');
const Path = require('path');


const execute = function(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      }
      console.info(`${stdout}`);
      resolve();
    });
  });
};

execute('npm run build')
  .then(() => {
    const packagePath = Path.resolve(__dirname, 'dist/package.json');
    const file = Fs.readFileSync(packagePath);
    const json = JSON.parse(file);
    delete json.private; // Used to prevent accidental publish

    console.info(`START PUBLISHING version: ${json.version}`);

    Fs.writeFileSync(packagePath, JSON.stringify(json), 'utf8');

    process.chdir(Path.resolve(__dirname, 'dist'));
    return execute('npm pack');
  })
  .then(() => {
    process.chdir(Path.resolve(__dirname));
    return execute('npm run test:integration');
  })
  .then(() => {
    console.info('--- PUBLISH COMPLETED ----');
  });
