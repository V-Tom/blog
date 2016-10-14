'use strict'
const exec = require('child_process').exec


const IP = '139.196.194.79'
const port = 27017
const user = 'admin'
const pwd = 'zhangchi123ZCNOMAND1106'
const dataBase = 'blog'
const collection = ''
const exportFile = ''
exec(`mongoexport -h ${Number(IP)} --port ${port} -u ${user} -p ${pwd}  -d ${dataBase} -c ${collection} --csv -o ${exportFile} `, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`)
    return
  }
  process.stdout.write(`stdout: ${stdout}`)
})
