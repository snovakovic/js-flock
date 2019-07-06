/* eslint-disable import/no-extraneous-dependencies */

const Path = require('path');
const Fs = require('node-fs-extra');
const Rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const { eslint } = require('rollup-plugin-eslint');
const { uglify } = require('rollup-plugin-uglify');

const options = {
  src: Path.resolve(__dirname, 'src/'),
  dist: Path.resolve(__dirname, 'dist/'),
  mandatoryFiles: ['README.md', 'publish.js', '.npmignore', 'package.json']
};

const plugins = [
  eslint({}),
  resolve({
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

options.mandatoryFiles.forEach((fileName) => Fs.copySync(fileName, `${options.dist}/${fileName}`));


// Transpile all source code with rollup

const modules = Fs.readdirSync(options.src).filter((file) => file.includes('.js'));

(function bundler(idx) {
  if (idx >= modules.length) return;

  const fileName = modules[idx];
  const moduleName = fileName === 'index.js' ? 'js-flock' : fileName;
  const input = `${options.src}/${fileName}`;
  const format = 'umd';

  const build = Rollup.rollup({ input, plugins })
    .then(bundle => bundle.write({
      name: moduleName,
      format,
      exports: fileName === 'index.js' ? 'named' : 'default',
      file: `${options.dist}/es5/${fileName.replace('.js', '.full.js')}`
    }));

  // NOTE: minified files will as defa
  const minifiedBuild = Rollup.rollup({
    input,
    plugins: [...plugins, uglify({})]
  }).then(async(bundle) => {
    // NOTE: Previosuly full version was saved as `name.js` and minigied as `name.min.js`
    // That have been updated to serve minified version by default with `name.js` and full version
    // with `name.full.js`. (keeping .min to be backward compatible)
    await bundle.write({
      name: moduleName,
      format,
      file: `${options.dist}/es5/${fileName.replace('.js', '.min.js')}`
    });

    return bundle.write({
      name: moduleName,
      format,
      file: `${options.dist}/es5/${fileName}`
    });
  });

  // Rollup fails if we don't build one at the time;
  Promise.all([build, minifiedBuild]).then(() => bundler(idx + 1));
}(0));
