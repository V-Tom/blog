"use strict";
class App {
    constructor(dbSource, auth, fields) {
        this._isValid(dbSource, auth);
        this._extend();
    }

    _isValid(dbSource) {
        let {poolInstance, collection}=dbSource;
        if (poolInstance && collection) {
            this.db = {poolInstance, collection};
        }
        else {
            throw new SyntaxError('dbSource object isn\'t valid at db.core.js line 17  ')
        }
    }

    _extend() {
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
    };
}

module.exports = App;

