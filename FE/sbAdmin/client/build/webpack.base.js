'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const DashboardPlugin = require('webpack-dashboard/plugin');

//Config
const environment = JSON.stringify(process.env.NODE_ENV)
const development = true

const reactLoader = development ? 'source-map-loader!react-hot!babel' : 'babel'
const chunkFilename = development ? '[name].js' : '[id].js'

const devtool = development ? 'cheap-module-eval-source-map' : null

// Plugins
const optimizePlugins = development ? [] : [
  new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false
    },
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.NoErrorsPlugin()
]

const extractTextPlugins = development ? [] : [

  new ExtractTextPlugin('app-[hash].css', {
    allChunks: true,
    disable: false
  }),

  //文件头部指定的注释信息
  new webpack.BannerPlugin('App FE')
]

const CommonsChunkPlugin = development ? [] : [
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-[hash].js')
]


module.exports = {
  debug: true,
  entry: development ?
    [path.join(__dirname, '../src/app.js')] :
  {
    vendor: ['react', 'react-dom', 'history', 'react-router', 'redux', 'react-redux', 'react-router-redux', 'moment', 'highcharts', 'highcharts/modules/map'],
    app: path.join(__dirname, '../src/app.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: development ? 'app.js' : '[name]-[hash].js',
    chunkFilename: chunkFilename,
    publicPath: '_assets/',
    sourceMapFilename: 'debugging/[file].map'
  },
  eslint: {
    fix: true
  },
  stats: { children: false },
  module: {
    // preLoaders: [
    //   { test: /\.(js|jsx|tsx)/, loader: 'eslint-loader!source-map-loader' }
    // ],
    loaders: [
      // {
      //   test: /\.tsx?$/,
      //   loader: 'react-hot!babel!ts-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.(js|jsx|tsx)/,
        loader: reactLoader,
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
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
        query: {
          limit: 10000,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.stylus$/,
        loader: development ? 'style!css?sourceMap!autoprefixer!stylus-loader?sourceMap' : ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!stylus-loader?sourceMap")
      },
      {
        test: /\.less$/,
        loader: development ? 'style!css?sourceMap!autoprefixer!less-loader?sourceMap' : ExtractTextPlugin.extract('less', 'css?sourceMap!less-loader?sourceMap')
      }, {
        test: /\.css$/,
        loader: development ? 'style!css?sourceMap!autoprefixer' : ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer')
      },
      {
        test: /\.scss$/,
        loader: development ? 'style!css?sourceMap!autoprefixer!sass?sourceMap' : ExtractTextPlugin.extract('sass', 'css?sourceMap!autoprefixer!sass?sourceMap')
      }
    ]
  },
  plugins: [
    //webpack dashboard
    new DashboardPlugin(),
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react-dom'),
    new webpack.PrefetchPlugin('react-router'),
    new webpack.PrefetchPlugin('redux'),
    new webpack.PrefetchPlugin('react-redux'),
    new webpack.PrefetchPlugin('history'),
    new webpack.DefinePlugin({
      __DEVCLIENT__: true,
      __DEVSERVER__: false,
      __DEVTOOLS__: false,
      __DEVLOGGER__: true,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ].concat(optimizePlugins, extractTextPlugins, CommonsChunkPlugin),
  resolve: {
    extension: ['', '.js', 'jsx']
  },
  externals: development ? {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    'redux': 'Redux',
    'react-redux': 'ReactRedux',
    'history': 'History'
  } : {},
  devServer: {
    host: '127.0.0.1',
    port: '3000',
    historyApiFallback: true,
    stats: {
      exclude: [/node_modules/]
    }
  },
  devtool: devtool
}
