/* eslint-disable import/no-extraneous-dependencies */

const Path = require('path');

const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const Fs = require('node-fs-extra');
const Rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');


const options = {
  src: Path.resolve(__dirname, 'src/'),
  dist: Path.resolve(__dirname, 'dist/'),
  mandatoryFiles: ['README.md', 'publish.js', '.npmignore']
};

const plugins = [
  eslint({}),
  babel({
    exclude: 'node_modules/**'
  })
];


// Clean dist folder

Fs.removeSync(options.dist);

// Copy all unmodified source files to dist

Fs.copy(options.src, options.dist);


// Copy all other required files to dist

options.mandatoryFiles.forEach((fileName) => Fs.copySync(fileName, `${options.dist}fileName`));


// Transpile all source code with rollup

const modules = Fs.readdirSync(options.src).filter((file) => file.includes('.js'));

modules.forEach((moduleName) => {
  const input = `${options.src}/${moduleName}`;
  const format = 'umd';

  Rollup.rollup({ input, plugins })
    .then((bundle) => {
      bundle.write({
        format,
        dest: `${options.dist}/es5/${moduleName}`
      });
    });

  // Minified bundle
  Rollup.rollup({
    input,
    plugins: [...plugins, uglify({})]
  }).then((bundle) => {
    bundle.write({
      format,
      dest: `${options.dist}/es5/${moduleName.replace('.js', '.min.js')}`
    });
  });
});
