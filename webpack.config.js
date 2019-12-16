const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SizePlugin = require('size-plugin');

module.exports = {
  mode: 'production',
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
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      }, {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?sourceMap',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'sal.css',
    }),
    new HtmlWebpackPlugin({
      template: './website/template/index.pug',
      filename: path.resolve(__dirname, './index.html'),
      inject: false,
    }),
    new SizePlugin({
      writeFile: false,
    }),
  ],
};
