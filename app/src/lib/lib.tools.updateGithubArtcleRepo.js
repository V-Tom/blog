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
const cmd = require('shelljs')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

const articleMDContainerLocalPath = path.join(__dirname, '../../../../')
const articleMDLocalPath = path.join(articleMDContainerLocalPath, '/blogArticle')

const init = function () {
  const ignoreAddr = ['.git', '.gitignore', 'READEME.md']

  if (!cmd.which('git')) {
    console.log(chalk.red('Sorry, this script requires git'))
    process.exit(1)
  }
  //check is file directory exits
  try {
    fs.statSync(articleMDLocalPath)
  } catch ( e ) {
    console.log(chalk.yellow(`-->[MKDIR] :There is no file directory in ${articleMDLocalPath}, we will crate it`))
    cmd.cd(articleMDContainerLocalPath)
    //clone form origin
    console.log(chalk.green('-->[GIT]: git clone git@github.com:V-Tom/blogArticle.git'))
    cmd.exec('git clone git@github.com:V-Tom/blogArticle.git')
  }

  cmd.cd(articleMDLocalPath)

  //pull form origin
  console.log(chalk.green('-->[GIT]: git pull origin master'))
  cmd.exec('git pull origin master')

}

exports.index = (articleName, data)=> {

  init()

  let fileAddr = fs.readdirSync(articleMDLocalPath)
  let nowDate = moment().format('YYYY-MM')

//check file date
  let newPath = path.join(articleMDLocalPath, `/${nowDate}`)

  if (fileAddr.indexOf(nowDate) === -1) {
    console.log(chalk.gray(`-->[MKDIR]: ${newPath}`))
    cmd.mkdir('-p', nowDate)
  }

  cmd.cd(newPath)

  articleName = articleName.split(' ').join('-')
  let writeFileName = `${articleName}.md`

  newPath = path.join(newPath, `/${writeFileName}`)
  console.log(chalk.green(`-->[WRITE]: ${newPath}`))
  fs.writeFileSync(newPath, data)
}

exports.push = ()=> {

  init()

  let command

  command = 'git status'
  console.log(chalk.green(`-->[GIT]: ${command}`))
  cmd.exec(command)

  command = 'git add .'
  console.log(chalk.green(`-->[GIT]: ${command}`))
  cmd.exec(command)

  command = 'git commit -a'
  console.log(chalk.green(`-->[GIT]: ${command}`))
  cmd.exec(command)

  command = 'git push origin master'
  console.log(chalk.green(`-->[GIT]: ${command}`))
  cmd.exec(command)
}