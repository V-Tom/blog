/**
 * Created by nomand on 31/05/2017.
 */

/**
 * webpack requires
 */
const webpack = require('webpack')
const path = require('path')

/**
 * webpack plugins
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackCommon = require('./webpack.base')
const WebpackMerge = require('webpack-merge')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

/**
 * Webpack Constants
 */

const ENV = process.env.NODE_ENV

const METADATA = {
  title: 'Welcome To TOM\'s Blog',
  description: '',
  baseUrl: '/',
  isDevServer: true,
  webAppMobileTitle: 'Tom\'s Blog',
  icon: 'https://img1a.flixcart.com/www/linchpin/batman-returns/images/logo_lite-cbb3574d.png',
  appleTouchIcon: 'https://img1a.flixcart.com/www/promos/new/20160610-194655-ios-logo.png'
}

/**
 * export
 */

module.exports = WebpackMerge(webpackCommon({

  env: ENV,

  entry: {
    'polyfill': 'babel-polyfill',
    'vendor': ['react', 'react-dom', 'history', 'react-redux', 'react-router', 'react-router-redux', 'whatwg-fetch', 'classnames', 'prop-types'],
    'main': path.resolve(__dirname, '../src/app.js')
  },

  path: path.resolve(__dirname, "../dist"),

  context: path.resolve(__dirname, '../src'),

}), {
  plugins: [

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),

    new ExtractTextPlugin({
      filename: 'full-stack-[hash].css'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV)
      }
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      cache: false,
      title: METADATA.title,
      description: METADATA.description,
      inject: 'body',
      metadata: METADATA,
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['vendor', 'polyfill', 'main']
        const order1 = orders.indexOf(chunk1.names[0])
        const order2 = orders.indexOf(chunk2.names[0])
        if (order1 > order2) {
          return 1
        } else if (order1 < order2) {
          return -1
        } else {
          return 0
        }
      },
      minify: {
        minifyJS: true,
        collapseWhitespace: true,
        removeComments: true
      }
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
      // prefetch: /(\.js|\.css)$/
    }),
    //
    // new UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   },
    //   compress: {
    //     warnings: false
    //   }
    // })

  ]
})