/**
 * Created by nomand on 31/05/2017.
 */

'use strict'
/**
 * Webpack Required
 */
const webpack = require('webpack')
const path = require('path')

/**
 * Webpack Plugins
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')


/**
 * Webpack Constants
 */
const cssModules = {
  modules: true,
  localIdentName: '[local]__[hash:base64:5]'
}

/**
 * Webpack Exported
 */
module.exports = ({ env, entry, context }) => {

  const isDevelopment = env === 'development' || env === 'dev'

  const nodeModules = /node_modules/

  return {

    entry,
    context,
    output: {

      path: path.resolve(__dirname, "../dist"),

      publicPath: '/',

      filename: `[name]-[hash].js`,

      sourceMapFilename: '[name].[hash].map',

      chunkFilename: isDevelopment ? '[name]-[hash].chunk.js' : '[name]-[hash].chunk.js'
    },

    resolve: {
      extensions: ['.js', 'jsx', 'tsx', 'stylus'],
      alias: {}
    },

    module: {

      rules: [
        {
          test: /\.js$/,
          use: isDevelopment ? [
            'source-map-loader',
            'babel-loader'
          ] : [
            'babel-loader'
          ],
          exclude: nodeModules
        },
        {
          test: /\.stylus$/,
          use: isDevelopment ?
            [
              'style-loader',
              {
                loader: 'css-loader',
                options: {}
              },
              {
                loader: 'postcss-loader'
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: true,
                }
              }
            ] :
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                },
                {
                  loader: 'postcss-loader'
                },
                {
                  loader: 'stylus-loader'
                }
              ]
            }),
          exclude: nodeModules
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader',
          options: {
            limit: 8 * 1024,
            name: '[name]-[hash:8].[ext]'
          },
          exclude: nodeModules
        },
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 10000,
                name: '[name].[ext]?[hash]'
              }
            }
          ],
          exclude: nodeModules
        }
      ]
    },

    plugins: [],

    performance: {
      hints: isDevelopment ? false : "warning",
      maxAssetSize: 200000,
      maxEntrypointSize: 400000,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
      }
    },

    stats: "errors-only",

    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    },

    devtool: isDevelopment ? '"inline-source-map"' : false
  }
}
