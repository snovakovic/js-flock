/* eslint-disable no-console */

const { exec } = require('child_process');
const Fs = require('fs');
const Path = require('path');


const execute = function(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        return reject(err);
      }
      console.info(`${stdout}`);
      return resolve();
    });
  });
};

execute('npm run build')
  .then(() => {
    const packagePath = Path.resolve(__dirname, 'dist/package.json');
    const file = Fs.readFileSync(packagePath);
    const json = JSON.parse(file);
    delete json.private; // Used to prevent accidental publish with npm publish
    delete json['//'];

    console.info(`\n\nSTART PUBLISHING version: ${json.version}\n\n`);

    Fs.writeFileSync(packagePath, JSON.stringify(json), 'utf8');

    process.chdir(Path.resolve(__dirname, 'dist'));
    return execute('npm publish');
  })
  .then(() => {
    process.chdir(Path.resolve(__dirname));
    return execute('npm run test:integration');
  })
  .then(() => {
    console.info('--- PUBLISH COMPLETED ----');
  });
