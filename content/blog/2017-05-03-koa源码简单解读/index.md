---
title: "koa 源码简单解读"
subTitle: "koa 源码简单解读"
banner: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=="
tags: ["Node.js","BackEnd"]
date: 2017-05-03T15:29:40+08:00
---

[Koa]() 是一个类似于 [Express]() 的 `Web`开发框架，创始人也都是[TJ]()

[Koa]() 的主要特点是，使用了`ES6` 的 `Generator ` 函数，进行了架构的重新设计。Koa 的原理和内部结构很像[Express]()，但是语法和内部结构进行了升级，最近已经发布了`2.x`版本，我们来直接看一下`2.x`版本的`koa`

### 创建 `Koa` 应用

我们可以按照官方的说明很简单的创建一个`koa`应用

```javascript
const koa = require('koa')

const app = new koa()

app.listen(3000)
```

或者可以这样：

```javascript
var koa = require('koa');
var http = require('http');

var app = new koa();

http.createServer(app.callback()).listen(4000);
```

这两种方式是等价的：

第一种方式:`listen`在内部主动创建一个一个`http server`并调用实例内部的 `callback`方法，把返回的`handleRequest`函数作为创建`http server`服务的回调函数，然后内部主动去`listen`。

参考源码 `listen`方法：

```javascript
  listen() {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen.apply(server, arguments);
  }
```

第二种方式:主动创建一个`http server`并主动调用实例的`callback`方法来生成一个`handleRequest`函数，最后`listen`端口号。

我们先以第一种写法作为入口，切入进去来分析源码。

首先实例化了一个`koa`实例，然后调用了`listen`方法:


### 简单解读:

`koa` 本身是没有定义事件处理机制的，其事件处理机制继承自`Node` 的`events`模块，本身就是在`events`模块上继承的一个实例

```javascript
// koa 源码解读
const Emitter = require('events');
module.exports = class Application extends Emitter {}
```

### constructor

我们来看一下 `constructor`

```javascript
// koa 源码解读
 constructor() {
    super();

    this.proxy = false;
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
```

> 我们要看的关键方法在于 `use`、`listen`、`compose`、`callback`，本篇文章（扯淡）会详细的说明，也算是自己的理解

### use方法

在`koa2`中，我们在使用中间件的方法很简单，只需要按照下面的方式就可以添加一层中间件：

```javascript
App.use( async ()=>{
  // 中间件
})
```

`koa`的一个很重要的概念就是中间件，这个官方讲的很详细，国内翻译的也通俗易懂，[地址](https://github.com/guo-yu/koa-guide),我这里就简单贴个图就好：

![koa middleware](https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67)

参考`use`方法：

```javascript
  // koa 源码加理解
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    // *** 省略代码
    this.middleware.push(fn);
    return this;
  }
```

`koa `对中间件的数量并没有限制，可以随意注册多个中间件。但如果有多个中间件，只要有一个中间件缺少 `yield next` 语句，后面的中间件都不会执行。

所以根据源码可以看到，`use`方法参数必须是个函数，也可以是个`GeneratorFunction`（deprecate），而且调用这个`use`方法后，`koa`实例内部会自动在`middleware`数组上`push`一个中间件。

### listen方法

```javascript
  // koa 源码加理解
  
  // 创建一个 http server
  const server = http.createServer(this.callback());
  
  // 显式返回 server
  return server.listen.apply(server, arguments);
```

在`listen`方法当中通过[http lib]()模块创建一个`http server`，然后调用了`this.callback()`作为这个新创建服务的回调函数，最后通过`apply`来调用`server.listen`方法，并把`this`指向新创建出来的`server`，并把`listen`方法的函数实参传入并返回。

### callback 方法

我们来看这个`this.callback`方法

```javascript
  // koa 源码加理解
  callback(){
     // compose
	  const fn = compose(this.middleware);
	  // *** 先省略下面代码
	}
```

这个`callback`方法当中有一个很重要的函数`compose`。

#### callback.compose

这个方法来自[koa-compose](https://github.com/koajs/compose)，按照官方的说法作用是: 

> Compose the given middleware and return middleware.

我的理解就是：它的作用是把一个个不相干的中间件串联在一起。我们来看看这个`compose`方法：

```javascript
function compose (middleware) {
  
  // *** 省略代码
  
  // 创建一个闭包便于访问 middleware
  // 根据上面 callback 可以看出，每次 http 请求，都会调用这个闭包函数，然后对整个 middleware 走一次遍历。
  return function (context, next) {
    
    // last called middleware #
    let index = -1
    
    // 第一次调用这个闭包，默认从第一个中间件开始
    return dispatch(0)
    function dispatch (i) {
    
      // 进行条件判断
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      
      // 在这里尝试执行中间件并进行错误捕捉
      // 然后把进入下一个中间件的方法作为参数传入当前中间件，也就是 next 函数，内部进行递归，注意这个递归是按顺序的。
      try {
        return Promise.resolve(fn(context, function next () {
        	// next 函数作为实参进行递归
          return dispatch(i + 1)
        }))
      } catch (err) {
      		// 错误捕捉
        return Promise.reject(err)
      }
    }
  }
}
```

`compose`被调用后返回一个闭包函数，在内部可以访问到 `middleware` 实参，也就是我们跟 `koa` 进行 `use` 的中间件。

返回函数`dispatch`方法内部返回一个递归，第一次调用的时候尝试执行第一个中间件，在内部进行错误捕捉。并且把递归下一个中间件的方法： `Function next`作为实参传给当前调用的中间件。

所以这也说明了为什么我们使用中间件的时候，`use`内部要显式的调用`yield next`，不然下面的中间件不会执行。

#### callback.handleRequest

跳过`compose`让我们继续看下面的代码：

```javascript
  // Koa 源码理解
  callback(){
    
    // *** 上面代码在上面，参照 compose 
   
	const handleRequest = (req, res) => {
	    
	  // 默认http状态码为404，即没有任何中间件修改过就是 404 。
	  res.statusCode = 404;
	    
	  // 创建上下文
	  const ctx = this.createContext(req, res);
	    
	  // 设置 error 分发
	  const onerror = err => ctx.onerror(err);
	    
	  // 设置 response 分发
	  const handleResponse = () => respond(ctx);
	    
	  // 统一设置 finished 分发，用于监听 http response 的结束事件，执行回调
	  onFinished(res, onerror);
	    
	  // 添加一个中间件的方法：app.use(middleware)
	  // 调用 compose 返回的闭包来按顺序处理所有的 middleware，并把 context 传入，所以每个中间件内部可以访问到 context
	    
	  fn(ctx).then(handleResponse).catch(onerror);
	    
	};
	
	  // 显式返回 handleRequest
	  return handleRequest;    
  }
```

上面调用`compose`后，显式返回了一个`handleRequest`函数来作为返回值来处理`http`请求


每次`http`请求，都会有以下流程：

- 状态码默认是`404`，当然在下面的中间件当中可以进行处理，这也方便了[koa-router]()进行匹配。
- 创建一个新的上下文：`createContext`,也就是`context`或者`ctx`
- 设置`error：onerror`，`response：respond`等分发
- 递归中间件并捕捉错误

> 根据上面的`listen`方法内部`http.createServer(this.callback())`可以看出，每次`http`请求都会走一次这个`callback`，返回一个函数：在函数内部创建全新的上下文，设置`error`，`response`，`finished`，最后调用`compose`来按照顺序走一次我们配置的所有的中间件。

我们接下来来看看 `createContext`和 `respond`以及`onFinished`


#### callback.createContext

```javascript
  // koa 源码理解
  createContext(req, res) {
  
    // 通过Object.create 来创建 上下文 request response
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    
    // 在 上下文 request response 上挂载 app 和 req 和 res 便于访问
    // app === this
    // req === httpServer.request
    // res === httpServer.response
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    
    // 在 request 上 挂载 上下文
    request.ctx = response.ctx = context;
    
    // 互相挂载
    request.response = response;
    response.request = request;
    
    // 挂载 原始请求地址
    context.originalUrl = request.originalUrl = req.url;
    
    // 挂载 cookies ，这里暂不深入
    context.cookies = new Cookies(req, res, {
      keys: this.keys,
      secure: request.secure
    });
    
    // 挂载原始ip
    request.ip = request.ips[0] || req.socket.remoteAddress || '';
    
    // 挂载 request accept
    context.accept = request.accept = accepts(req);
    
    // 当前上下文的state，官方推荐设置state最好的方式
    context.state = {};
    
    // 显式返回 上下文
    return context;
  }
```

#### callback.respond

```javascript
function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (!ctx.writable) return;

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    body = ctx.message || String(code);
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}

```


#### callback.onFinished