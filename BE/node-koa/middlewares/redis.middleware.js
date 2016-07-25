const exp = process.env.NODE_ENV === "development" ? global.config.app.redis.redisExpDev : global.config.app.redis.redisExp;

module.exports.get = (key)=> {
    return new Promise((resolve, rejcect)=> {
        global.redis.get(key, (err, reply)=> {
            if (err) {
                resolve(err)
            }
            if (reply) {
                resolve(reply.toString())
            }
            resolve(null)
        })
    })
}

module.exports.set = (key, value)=> {
    return new Promise((resolve, reject)=> {
        global.redis.set(key, value, 'EX', exp, () => {
            resolve(JSON.parse(value))
        })
    })
}