const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { resolve } = require('path');
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production'; // true or false
const cssDev = [
  'style-loader',
  'css-loader?sourceMap',
  'sass-loader',
  {
    loader: 'sass-resources-loader',
    options: {
      // Provide path to the file with resources
      resources: ['./src/resources.scss'],
    },
  },
];

const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    'css-loader',
    'sass-loader',
    {
      loader: 'sass-resources-loader',
      options: {
        // Provide path to the file with resources
        resources: ['./src/resources.scss'],
      },
    },
  ],
  publicPath: '',
});

const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch', // activate HMR for React
      'webpack-dev-server/client?http://localhost:8080', // bundle the client for webpack-dev-server and connect to the provided endpoint
      'webpack/hot/only-dev-server', // bundle the client for hot reloading only- means to only hot reload for successful updates
      './src/index.js' // the entry point of our app
    ],
    bootstrap: bootstrapConfig // vendor entry point for (bootstrap)
  },
  output: {
    filename: 'js/[name].bundle.js', // the output bundle
    path: resolve(__dirname, 'build'),
    publicPath: '/' // necessary for HMR to know where to load the hot update chunks
  },
  // devtool: 'source-map',
  devServer: {
    hot: true, // enable HMR on the server
    contentBase: resolve(__dirname, 'build'), // match the output path
    publicPath: '/' // match the output `publicPath`
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: cssConfig,
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['file-loader?name=/images/[name].[ext]', 'image-webpack-loader?bypassOnDebug'],
      },
      {
        test: /\.(woff2?)$/,
        use: 'url-loader?limit=10000&name=/fonts/[name].[ext]'
      },
      {
        test: /\.(ttf|eot)$/,
        use: 'file-loader?name=/fonts/[name].[ext]'
      },
      // Bootstrap 3
      {
        test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        use: 'imports-loader?jQuery=jquery'
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
    new ExtractTextPlugin({
      filename: './css/[name].css',
      disable: !isProd,
      allChunks: true,
    }),
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(
        resolve(__dirname, 'src/*.html')
      ),
      purifyOptions: {
        whitelist: ['on-scroll', 'nav-pad'],
      },
    }),
  ],
};
