'use strict';
const serverLogger = require('../logger').server;

const getRedis = ()=> {
    let {REDIS_INSTANCE}=global;

    if (REDIS_INSTANCE) {
        return REDIS_INSTANCE;
    }
    const redis = require("redis"),

        client = redis.createClient({
            password: "zhangchi123ZC"
        });

    REDIS_INSTANCE = global.REDIS_INSTANCE = client;
    
    client.on("error", function (err) {
        console.error(`redis error : ${err}`);
    });

    return REDIS_INSTANCE;
};
module.exports = getRedis();
