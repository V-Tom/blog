const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',

  entry: {
    bundle: path.join(__dirname, './index.js')
  },

  output: {
    path: path.join(__dirname, '../static/js/gallery'),
    filename: 'gallery.bundle.js'
    // filename: 'gallery-[name].[hash:8].js',
    // chunkFilename: '[name].[chwunkhash:8].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: []
};
