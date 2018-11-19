'use strict'

const fs = require('fs')
const path = require('path');

(_ => {

  const localSWPath = path.join(__dirname, './static/sw.origin.js')
  const targetSWPath = path.join(__dirname, './static/sw.js')

  const version = Date.now()
  const makeVersion = version => `const VERSION_NAME = 'CACHE-v${version}';`

  console.log(`\n Ready to rewrite sw.js with version : ${version} \n`)

  fs.writeFileSync(targetSWPath, `${makeVersion(version)}\n${fs.readFileSync(localSWPath).toString()}`)

})();