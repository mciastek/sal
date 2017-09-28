const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/sal.js',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'sal.js',
    library: 'Sal',
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
