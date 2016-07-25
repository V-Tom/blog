'use strict';
const path = require('path')
const dbPort = '139.196.194.79:27017'
module.exports = {
    app: {
        port: 4000,
        root: path.join(__dirname, '../'),
        db: {
            port: dbPort,
            users: {uri: 'mongodb://admin:zhangchi123ZC@' + dbPort + '/user'},
            blog: {uri: 'mongodb://admin:zhangchi123ZC@' + dbPort + '/blog'},
            cache: {uri: 'mongodb://admin:zhangchi123ZC@' + dbPort + '/cache'}
        },
        redis: {
            redisExpDev: 60,
            redisExp: 60 * 60 * 24 * 1
        },
        env: "development"
    }
}