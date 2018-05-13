'use strict'

const fs = require('fs')
const path = require('path');

(_ => {

  const localSWPath = path.join(__dirname, './static/sw.origin.js')
  const targetSWPath = path.join(__dirname, './static/sw.js')

  const makeVersion = version => `const VERSION_NAME = 'CACHE-v${version}';`

  fs.writeFileSync(targetSWPath, `${makeVersion(Date.now())}\n${fs.readFileSync(localSWPath).toString()}`)

})();