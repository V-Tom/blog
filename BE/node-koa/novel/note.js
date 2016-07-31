'use strict'
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
//864
const novelLength = 864

let fail = fs.createWriteStream('./fail.txt')

function tryAgain(arr) {
  arr.forEach(index=> {
    request({
      url: `http://baidu.book.3g.cn/xuan/index.php?c=home&m=book&a=content&bookid=343124&menuid=${index}`,
      timeout: 10000
    }, (err, res, body)=> {
      if (!err && res.statusCode == 200 && body) {
        let $ = cheerio.load(String(body))
        let novelTitle = $('.Readtitle').text()
        let p = $('.Readarea').find('p')

        let stream = fs.createWriteStream(`./list/novel-${index}.txt`, { defaultEncoding: 'utf8' })
        stream.on('open', ()=> {
          // console.log(`正在写入${i}小说`)
        })
        stream.on('close', ()=> {
          // console.log(`写入${i}小说成功`)
        })
        stream.write(`第${index}章:${novelTitle}\n`)
        p.each((i, elem)=> {
          stream.write($(elem).text() + '\n')
        });
      } else {
        fail.write(index + ',')
        console.log(index)
      }
    })

  })
}

function getNovel() {
  for (let i = 600; i <= novelLength; i++) {
    request('http://baidu.book.3g.cn/xuan/index.php?c=home&m=book&a=content&bookid=343124&menuid=' + i, (err, res, body)=> {
      if (!err && res.statusCode == 200 && body) {
        let $ = cheerio.load(String(body))
        let novelTitle = $('.Readtitle').text()
        let p = $('.Readarea').find('p')

        let stream = fs.createWriteStream(`./list/novel-${i}.txt`, { defaultEncoding: 'utf8' })
        stream.on('open', ()=> {
          // console.log(`正在写入${i}小说`)
        })
        stream.on('close', ()=> {
          // console.log(`写入${i}小说成功`)
        })
        stream.write(`第${i}章:${novelTitle}\n`)
        p.each((i, elem)=> {
          stream.write($(elem).text() + '\n')
        });
      } else {
        tryAgain(i)
      }
    })
  }
}

fs.readdir('./list', (err, status)=> {
  console.log(status.length)
})

let index = 1
let arrt = []
let writeFinalNovelStream = fs.createWriteStream('./novel.txt')
function writeNovel() {
  if (index > 864) {
    console.log(arrt)
    return false
  }
  let read = fs.createReadStream(`./list/novel-${index}.txt`)
  read.on('data', (thunk)=> {
    writeFinalNovelStream.write(thunk.toString('utf8'))
  })
  read.on('error', ()=> {
    arrt.push(index)
    index++
    writeNovel()
  })
  read.on('end', ()=> {
    index++
    writeNovel()
  })
}

writeNovel()

// tryAgain([491, 492, 8, 195, 448, 428, 417, 464, 452, 454, 451, 489, 488, 480, 483, 499, 560, 761, 830, 781, 108, 74, 93, 526, 508])