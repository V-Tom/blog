"use strict";
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const MongoClient = require('mongodb').MongoClient;
const app = express();
const EventEmitter = require('events');

const config = require('../../config');

process.env.NODE_ENV = 'development';

//set global variables
global.CONFIG = config;
global.MONGO_POOL = {};
Promise.all([
    MongoClient.connect(config.db.port.cache),
    MongoClient.connect(config.db.port.blog),
    MongoClient.connect(config.db.port.users)
]).then((clients)=> {
    var MONGO_POOL = global.MONGO_POOL,
        poolName = ['cache', 'blog', 'users'];
    clients.forEach((item, index)=> {
        MONGO_POOL[poolName[index]] = item;
    });
}).catch(err=> {
    console.log(err);
});


const apiVersion = config.apiVersion;
const ConfigSession = config.session;


app.set('env', config.app.env);
app.set('views', path.join(__dirname, '../../views/main'));
app.set('view engine', 'jade');
app.set('x-powered-by', false);
app.set('etag', true);

//favicon
// app.use(favicon(path.join(__dirname, './static', 'favicon.ico')));
//gzip
app.use(compression({level: 9}));
//logger
app.use(logger('dev'));
//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//static
// app.use('/static/dist', express.static(path.join(__dirname, './dist'), {
//     maxAge: config.app.maxAge
// }));

//api crows
app.use('/api', (req, res, next)=> {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.status(200)
    }
    next();
});


//session
app.use(session(ConfigSession(MongoStore)));

//custom router
const index = require('../../routes/main/index');
const blogApi = require('../../routes/main/api/blog');
const toolsApi = require('../../routes/main/api/tools');
const authApi = require('../../routes/main/api/auth');

app.use('/', index);
app.use('/api/' + apiVersion + '/blog', blogApi);
app.use('/api/' + apiVersion + '/auth', authApi);
app.use('/api/' + apiVersion + '/tools', toolsApi);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (err.status != 404) {
            console.error(err.message);
            console.error(err.stack);
            res.render('error', {
                title: "Error-dev",
                message: err.message,
                error: err
            });
        }
        next();
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: 'Error',
        message: err.message,
        error: {}
    });
    next();
});


if (!Promise.always) {
    Promise.prototype.always = function (callback) {
        var P = this.constructor;
        return this.then(
            (result) => {
                return P.resolve(callback()).then(()=> {
                    return result;
                })
            }, (err)=> {
                return P.resolve(callback()).then(()=> {
                    throw err;
                })
            });
    };
}

module.exports = app;

