/**
 * Created by nomand on 31/05/2017.
 */

'use strict'
/**
 * Webpack Required
 */
const commonConfig = require('./webpack.base.js')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

/**
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV

const METADATA = {
  title: 'Welcome To Tom\'s Blog',
  baseUrl: '/',
  isDevServer: true
}

/**
 * Webpack Exported
 */
module.exports = () => webpackMerge(commonConfig({

  env: ENV,

  entry: {
    'vendor': ['react', 'history', 'react-router', 'whatwg-fetch', 'classnames', 'prop-types'],
    'main': path.resolve(__dirname, '../src/app.js')
  },

  context: path.resolve(__dirname, '../src'),

}), {
  devServer: {
    contentBase: path.resolve(__dirname, '../src'),
    clientLogLevel: 'info',
    host: '0.0.0.0',
    port: 9000,
    https: true,
    hot: true,
    noInfo: false,
    disableHostCheck: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },

    stats: {
      colors: true,
      exclude: [/node_modules/]
    }
  },
  plugins: [

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      cache: false,
      title: METADATA.title,
      metadata: METADATA,
      inject: 'body',
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['vendor', 'main']
        const order1 = orders.indexOf(chunk1.names[0])
        const order2 = orders.indexOf(chunk2.names[0])
        if (order1 > order2) {
          return 1
        } else if (order1 < order2) {
          return -1
        } else {
          return 0
        }
      }
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
      prefetch: /(.css)$/
    }),

    new webpack.DefinePlugin({
      __DEVCLIENT__: true,
      __DEVSERVER__: true,
      __DEVTOOLS__: true,
      __DEVLOGGER__: true,
      'process.env': {
        NODE_ENV: JSON.stringify(ENV)
      }
    })
  ]
})
