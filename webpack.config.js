const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/sal.js',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'sal.js',
    library: 'sal',
    libraryTarget: 'umd',
    libraryExport: 'default',
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?minimize&sourceMap!postcss-loader!sass-loader',
        }),
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('sal.css'),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: './website/template/index.pug',
      filename: path.resolve(__dirname, './index.html'),
      inject: false,
    }),
  ],
};
