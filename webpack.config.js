const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch', // activate HMR for React
      'webpack-dev-server/client?http://localhost:8080', // bundle the client for webpack-dev-server and connect to the provided endpoint
      'webpack/hot/only-dev-server', // bundle the client for hot reloading only- means to only hot reload for successful updates
      './src/index.js' // the entry point of our app
    ]
  },
  output: {
    filename: 'js/[name].bundle.js', // the output bundle
    path: resolve(__dirname, 'build'),
    publicPath: '/' // necessary for HMR to know where to load the hot update chunks
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true, // enable HMR on the server
    contentBase: resolve(__dirname, 'build'), // match the output path
    publicPath: '/' // match the output `publicPath`
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
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
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
