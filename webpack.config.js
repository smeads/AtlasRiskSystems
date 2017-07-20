const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: [
    // activate HMR for React
    'react-hot-loader/patch',
    // bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for hot reloading only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',
    // the entry point of our app
    './src/index.js'
    ]
  },
  output: {
    // the output bundle
    filename: 'js/[name].bundle.js',
    path: resolve(__dirname, 'build'),
    // necessary for HMR to know where to load the hot update chunks
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  devServer: {
    // enable HMR on the server
    hot: true,
    // match the output path
    contentBase: resolve(__dirname, 'build'),
    // match the output `publicPath`
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader?modules', ],
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      },
    ],
  },
  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
      // minify: {
      //   collapseWhitespace: true,
      // },
    }),
  ],
};
