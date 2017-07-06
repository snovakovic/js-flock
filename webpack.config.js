const Path = require('path');
const Webpack = require('webpack');
const Glob = require('glob');

const src = Path.resolve(__dirname, 'src/');

module.exports = {
  entry: Glob.sync(`${src}/*.js`),
  output: {
    path: Path.resolve(__dirname, 'es5/'),
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
    new Webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};
