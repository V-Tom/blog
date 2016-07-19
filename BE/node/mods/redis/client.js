'use strict';
let REDIS_INSTANCE = null;
const serverLogger = require('../logger').server;

const getRedis = ()=> {
    if (REDIS_INSTANCE) {
        return REDIS_INSTANCE;
    }
    const redis = require("redis"),

        client = redis.createClient({
            password: "zhangchi123ZC"
        });

    REDIS_INSTANCE = client;

    client.on("error", function (err) {
        console.error(`redis error : ${err}`);
    });

    return REDIS_INSTANCE;
};
module.exports = getRedis();
