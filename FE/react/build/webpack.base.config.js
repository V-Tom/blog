const development = process.env.NODE_ENV === 'development'
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');

const entry = development ? [path.join(__dirname, '../src/app.js')] : {
  vendor: ['react', 'react-dom', 'history', 'react-router', 'redux', 'react-redux', 'react-router-redux'],
  fullStack: path.join(__dirname, '../src/app.js')
}

const devTools = development ? 'cheap-module-eval-source-map' : null

const plugins = [
  new DashboardPlugin(),
  new webpack.PrefetchPlugin('react'),
  new webpack.PrefetchPlugin('react-dom'),
  new webpack.PrefetchPlugin('react'),
  new webpack.PrefetchPlugin('react-dom'),
  new webpack.PrefetchPlugin('react-router'),
  new webpack.PrefetchPlugin('redux'),
  new webpack.PrefetchPlugin('react-redux'),
  new webpack.PrefetchPlugin('history')
];


const CommonsChunkPlugin = development ? [] : [
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-[hash].js')
]


module.exports = {
  debug: true,
  entry: entry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: development ? 'fullStack.js' : 'fullStack-[hash].js',
    publicPath: '_assets/',
    chunkFilename: development ? '[id].js' : '[name].js',
    sourceMapFilename: 'debugging/[file].map'
  },
  stats: { children: false },
  module: {
    preLoaders: [
      // { test: /\.(js|jsx|tsx)/, loader: "eslint-loader!source-map-loader" }
    ],
    loaders: [
      {
        test: /\.(js|jsx|tsx)/,
        loader: development ? 'source-map-loader!react-hot!babel' : 'babel',
        exclude: /node_modules/
      },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
        query: {
          limit: 10000,
          name: '[name].[ext]'
        }
      }, {
        test: /\.css$/,
        loader: development ? 'style!css?sourceMap!autoprefixer' : ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")
      }, {
        test: /\.stylus$/,
        loader: development ? 'style!css?sourceMap!autoprefixer!stylus-loader?sourceMap' : ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!stylus-loader?sourceMap")
      }
    ]
  },
  plugins: plugins.concat(CommonsChunkPlugin),
  resolve: {
    // require时省略的扩展名，如：require('module') 不需要module.js
    extension: ['', '.js', 'jsx'],
    alias: {}
  },
  externals: {
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
    // 'react-router': 'ReactRouter',
    // 'redux': 'Redux',
    // 'react-redux': 'ReactRedux',
    // 'history': 'History'
  },
  devtool: devTools
};
