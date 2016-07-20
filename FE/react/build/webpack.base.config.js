var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
var webpack = require("webpack");
var path = require('path');

const entry = [path.join(__dirname, '../src/app.js'), hotMiddlewareScript]
const plugins = [
    //提交公用的js文件到common.js文件中
    //new CommonsChunkPlugin('common.js'),

    //将样式统一发布到style.css中
    new ExtractTextPlugin("style.css", {
        allChunks: true,
        disable: false
    }),
    //文件头部指定的注释信息
    new webpack.BannerPlugin('This file is created by Nomand')
];


module.exports = {
    debug: true,
    entry: entry,
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    stats: {children: false},
    module: {
        loaders: [
            {
                test: /\.js$|\.jsx$/,
                loader: 'babel',
                query: {
                    "presets": ["es2015", "react", "stage-0", "react-hmre"],
                    "plugins": ["transform-decorators-legacy"]
                },
                exclude: /node_modules/
            },
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
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")
            }, {
                test: /\.stylus$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader?sourceMap")
            }
        ]
    },
    plugins: plugins,
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extension: ['', '.js', 'jsx'],
        alias: {}
    },
    externals: {
        jquery: false
    }
};
