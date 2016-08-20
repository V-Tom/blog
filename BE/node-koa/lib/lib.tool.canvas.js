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
//         | | :  `- \`.`\ _ /`.`/ - ` : | |
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
const Canvas = require('canvas')
exports.index = function (length) {
  function _getRandomCode() {
    let key = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPRSTUVWXYZ1234567890'.split('')
    let code = '', i
    for (i = 0; i < length; i++
    ) {
      code += key[Math.round(Math.random() * (length - 1))]
    }
    return code
  }

  function _setCodeStyle(ctx, code) {
    ctx.font = '15px serif'
    ctx.fillStyle = 'rgba(0,0,0,.8)'
    var codeList = code.split('')
    for (var i = 0; i < length; i++) {
      ctx.fillText(codeList[i], 15 * i, 20)
    }
    ctx.beginPath()
    ctx.stroke()
  }

  length = length || 8

  let canvas = new Canvas(length * 15, 30)
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, length * 15, 30)

  //random code
  let code = _getRandomCode()

  //draw canvas style
  _setCodeStyle(ctx, code)

  //export
  return {
    canvas: canvas.toDataURL(),
    code: code
  }
}
