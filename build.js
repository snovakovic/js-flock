/* eslint-disable import/no-extraneous-dependencies */

const Path = require('path');

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const Fs = require('node-fs-extra');
const resolve = require('rollup-plugin-node-resolve');
const Rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');


const options = {
  src: Path.resolve(__dirname, 'src/'),
  dist: Path.resolve(__dirname, 'dist/'),
  mandatoryFiles: ['README.md', 'publish.js', '.npmignore']
};

const plugins = [
  eslint({}),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs({
    include: 'src/**'
  }),
  babel({
    exclude: 'node_modules/**',
    externalHelpers: true
  })
];


// Clean dist folder

Fs.removeSync(options.dist);

// Copy all unmodified source files to dist

Fs.copy(options.src, options.dist);


// Copy all other required files to dist

options.mandatoryFiles.forEach((fileName) => Fs.copy(fileName, `${options.dist}fileName`));


// Transpile all source code with rollup

const modules = Fs.readdirSync(options.src).filter((file) => file.includes('.js'));

(function bundler(idx) {
  if (idx >= modules.length) return;

  const fileName = modules[idx];
  const input = `${options.src}/${fileName}`;
  const format = 'umd';

  const moduleName = fileName === 'index.js' ? 'js-flock' : fileName;

  const build = Rollup.rollup({ input, plugins })
    .then((bundle) =>
      bundle.write({
        moduleName,
        format,
        exports: 'default',
        dest: `${options.dist}/es5/${fileName}`
      }));

  const minifiedBuild =
    Rollup.rollup({
      input,
      plugins: [...plugins, uglify({})]

    }).then((bundle) => {
      bundle.write({
        moduleName,
        format,
        dest: `${options.dist}/es5/${fileName.replace('.js', '.min.js')}`
      });
    });

  // Rollup fails if we don't build one at the time;
  Promise.all([build, minifiedBuild]).then(() => bundler(idx + 1));
}(0));
