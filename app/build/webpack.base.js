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
const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: 'inline',
    plugins: (loader) => [
      require('autoprefixer')({ browsers: ['> 5%', 'last 2 versions'], remove: false }),
    ]
  }
}
const cssModulesRule = '[local]__[hash:base64:5]'
/**
 * Webpack Exported
 */
module.exports = ({ env, entry, context }) => {

  const isDevelopment = env === 'development' || env === 'dev'

  const nodeModules = /node_modules/

  /**
   * chunkhash 增量包
   * @type {string}
   */
  const chunkhash = 'hash'

  return {

    entry,
    context,
    output: {

      path: path.resolve(__dirname, "../dist"),

      publicPath: isDevelopment ? '/' : 'https://static.t-tom.me/',

      filename: isDevelopment ? `[name]-[hash].js` : `[name]-[${chunkhash}].js`,

      sourceMapFilename: '[name].[hash].map',

      chunkFilename: isDevelopment ? '[name]-[hash].chunk.js' : `[name]-[${chunkhash}].chunk.js`,

      crossOriginLoading: 'anonymous'
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
          test: /\.M.less/,
          use: isDevelopment ?
            [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  modules: true,
                  localIdentName: cssModulesRule
                }
              },
              postCssLoader,
              {
                loader: 'less-loader',
                options: {
                  outputStyle: 'expanded',
                  sourceMap: true,
                  sourceMapContents: true,
                  sourceComments: true
                }
              }
            ] :
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true,
                    modules: true,
                    localIdentName: cssModulesRule
                  }
                },
                postCssLoader, 'less-loader']
            }),
          exclude: nodeModules
        },
        {
          test: /^((?!\.M).)*less/,
          use: isDevelopment ? ['style-loader', 'css-loader?sourceMap=true', postCssLoader, 'less-loader'] :
            [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader'
              },
              postCssLoader,
              {
                loader: 'less-loader'
              }
            ],
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
