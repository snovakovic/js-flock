const CopyWebpackPlugin = require('copy-webpack-plugin');
const Glob = require('glob');
const Path = require('path');
const Webpack = require('webpack');

const src = Path.resolve(__dirname, 'src/');
const dist = Path.resolve(__dirname, 'dist/');

// Generate entry for each module
const modules = Glob.sync(`${src}/*.js`);
const entry = {};
modules.forEach((path) => {
  const arr = path.split('/');
  const name = arr[arr.length - 1].replace('.js', '');
  entry[name] = path;
  entry[`${name}.min`] = path;
});

module.exports = {
  entry,
  output: {
    path: `${dist}/es5`,
    filename: '[name].js',
    library: 'js-flock',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: src,
      exclude: /node_modules/,
      query: {
        presets: [['es2015', { modules: false }]],
        plugins: ['syntax-dynamic-import']
      }
    }]
  },
  plugins: [
    new Webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new CopyWebpackPlugin([
      { from: src, to: dist },
      { from: Path.resolve(__dirname, 'package.json'), to: dist },
      { from: Path.resolve(__dirname, 'README.md'), to: dist },
      { from: Path.resolve(__dirname, 'CHANGELOG.md'), to: dist }
    ])
  ]
};
