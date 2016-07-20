'use strict';
const redis = require('./client');
const exp = process.env.NODE_ENV === "development" ? global.CONFIG.redis.redisExpDev : global.CONFIG.redis.redisExp;
const set = (key, value, cb)=> {
    redis.set(key, value, 'EX', exp, () => {
        cb && cb(key, value, exp);
    })
};

const get = (key)=> {
    return new Promise((resolve, reject)=> {
        redis.get(key, (err, reply)=> {
            if (err) {
                reject(err);
            }
            if (reply) {
                resolve(reply.toString())
            }
            reject();
        })
    });
};
module.exports = {
    get: get,
    set: set
};
