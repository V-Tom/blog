//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
'use strict'
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = config.app.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = config.app.qiniu.SECRET_KEY

exports.uploadFile = ()=> {
  return function *() {
    let putPolicy = new qiniu.rs.PutPolicy(config.app.qiniu.bucket)
    putPolicy.expires = config.app.qiniu.signedUrlExpires
    let token = putPolicy.token()
    this.body = {
      url: 'http://up.qiniu.com/',
      token: token
    }
  }
}