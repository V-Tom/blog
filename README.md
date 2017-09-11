##Tom's koa server
---

### Engines
`node` > `>=6.2.0`

### dev
`npm run dev`

### online
`make builds`

### test
`npm install test`

### Notice

> You need define local test mongodb to run mocha test. see `./test/mongodb.conf` get more detail

> You need to install mongodb and edit `./src/config/index.js` to define mongodb instance connect use local

> You need to install redis and start it without auth

> You need to install node-canvas. And this repo is not supposed on windows. But you can change it in `./src/lib/lib.tool.canvas.js` to remove `node-canvas`