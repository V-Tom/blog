"use strict";
const core = require('./db.core');
const Utils = require('../utils');
const Json = require('../jsonWrap');
const dbFindTimeKey = "dbQueryTime";
class App extends core {
    constructor(dbSource) {
        super(dbSource);
    }

    find(query, cursor) {
        let start = new Date();
        return new Promise((resolve, reject)=> {
            if (typeof query !== 'object') {
                reject('query must be an object');
            } else {
                let collection = this.db.poolInstance.collection(this.db.collection);
                if (cursor) {
                    let key, CURSOR;
                    CURSOR = collection.find(query);
                    try {
                        for (key in cursor) {
                            if (cursor.hasOwnProperty(key)) {
                                CURSOR[key](cursor[key])
                            }
                        }
                    } catch (ex) {
                        reject(Json.error(err, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                    }
                    CURSOR.toArray().then((docs) => {
                        resolve(Json.success(docs, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                    }).catch((err)=> {
                        reject(Json.error(err, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                    })
                } else {
                    collection.find(query).toArray().then((docs) => {
                        resolve(Json.success(docs, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                    }).catch((err)=> {
                        reject(Json.error(err, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                    });
                }
            }
        });
    }

    findOne(query, options) {
        let start = new Date();
        let {poolInstance, collection}=this.db;
        return new Promise((resolve, reject)=> {
            if (!poolInstance || !collection) {
                reject("pool name or collection name is not available !");
            }
            if (typeof query !== 'object') {
                reject('query must be an object');
            }
            poolInstance.collection(collection).findOne(query, options).then((docs)=> {
                resolve(Json.success(docs, {[dbFindTimeKey]: new Date() - start + 'ms'}));
            }).catch(()=> {
                reject(Json.error(err, {[dbFindTimeKey]: new Date() - start + 'ms'}));
            });
        });
    };

    findOneAndUpdate(query, replaceDoc, options, type) {

        let currentOptions, start = new Date(),

        //默认是 $set 更新文档
            defaultUpdateType = "$set",

        //see http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findOneAndUpdate
            defaultOptions = {
                //Limits the fields to return for all matching documents.
                // 对匹配到的所有文档进行limit处理
                projection: null,
                //The maximum amount of time to allow the query to run.
                //最大查找时间
                maxTimeMS: null,
                //Determines which document the operation modifies if the query selects multiple documents.
                sort: null,
                //Upsert the document if it does not exist.
                // 如果文档不存在是否创建新文档
                upsert: true,
                //When false, returns the updated document rather than the original. The default is true.
                //如果设置为false，返回更新后的文档而不是旧的文档
                returnOriginal: false
            };


        options && Utils.isObject(options) ?
            currentOptions = Utils.extendDeep(defaultOptions, options)
            : currentOptions = defaultOptions;


        //see https://docs.mongodb.org/v3.0/reference/operator/update-field/
        //see http://www.runoob.com/mongodb/mongodb-atomic-operations.html
        var updateTypeList = ['$inc', '$set', '$rename', '$mul', '$setOnInsert', '$unset', '$min', '$max', 'currentDate'];

        if (type && updateTypeList.indexOf(type) !== -1) {
            defaultUpdateType = type
        }

        return new Promise((resolve, reject)=> {
            if (!Utils.isObject(query) || !Utils.isObject(replaceDoc)) {
                reject('filter or  replaceDoc must be an object at line 124');
            } else {
                let collection = this.db.poolInstance.collection(this.db.collection);
                collection.findOneAndUpdate(query, {[defaultUpdateType]: replaceDoc}, currentOptions).then((docs)=> {
                    resolve(Json.success(docs, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                }).catch((err)=> {
                    reject(Json.error(err, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                });
            }
        });
    };

    findOneAndDelete(filter, options) {

        let currentOptions, start = new Date(),
            defaultOptions = {
                //Limits the fields to return for all matching documents.
                // 对匹配到的所有文档进行limit处理
                projection: null,
                //The maximum amount of time to allow the query to run.
                //最大查找时间
                maxTimeMS: null,
                //Determines which document the operation modifies if the query selects multiple documents.
                sort: null
            };
        options ? Utils.isObject(options) ? currentOptions = Utils.extendDeep(defaultOptions, options)
            : currentOptions = defaultOptions : currentOptions = defaultOptions;
        return new Promise((resolve, reject)=> {
            if (!Utils.isObject(filter)) {
                reject('filter must be an object');
            } else {
                let collection = this.db.poolInstance.collection(this.db.collection);
                collection.findOneAndDelete(filter, currentOptions).then((docs)=> {
                    resolve(Json.success(docs, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                }).catch((err)=> {
                    reject(Json.error(err, {[dbFindTimeKey]: new Date() - start + 'ms'}));
                });
            }
        });
    }
}
module.exports = App;
