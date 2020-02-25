---
title: '前端性能检测和错误捕捉'
subTitle: '前端性能检测和错误捕捉'
banner: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=='
tags: ['RN', 'FrontEnd', 'Monitor']
date: 2017-09-12T15:29:40+08:00
---

在复杂的网络环境和浏览器环境下，自测、QA 测试以及 Code Review 都是不够的，如果对页面稳定性和准确性要求较高，就必须有一套完善的代码异常监控体系好的产品，这样才能很好的得到用户的反馈从而不断的迭代改进我们的产品。

而且复杂的用户终端设备，也需要通过性能监控发现部分前端性能瓶颈，以便进行优化；通过错误日志收集，及时获得前端的运行时错误

## 收集错误异常

> 错误异常分为 **web 错误异常**和**React-native 错误异常**

### web 错误异常

总体来说：平时收集日志的手段，可以归类为两个方面，一个是逻辑中的错误判断，为主动判断，如`try...catch`；一个是利用语言给我们提供的捷径，暴力式获取错误信息，如 `window.onerror`；当然也存在另外一种错误，那就是`Promise unhandlerejection`

#### try…catch

判断一个代码段中可能存在的错误：

```javascript
try {
  doSomeThing()
  // code...
} catch (e) {
  // send format error
  Reporter.send(format(e))
}
```

#### window.onerror

这个用来捕获全局错误：

```javascript
window.onerror = function() {
  // send format error
  var errInfo = format(arguments)
  Reporter.send(errInfo)
  return true
}
```

在上面的函数中返回 `return true`，错误便不会暴露到控制台中。下面是它的参数信息：

```javascript
/**
 * @param {String}  errorMessage   错误信息
 * @param {String}  scriptURI      出错的文件
 * @param {Long}    lineNumber     出错代码的行号
 * @param {Long}    columnNumber   出错代码的列号
 * @param {Object}  errorObj       错误的详细信息，Anything
 */
window.onerror = function(
  errorMessage,
  scriptURI,
  lineNumber,
  columnNumber,
  errorObj,
) {
  // code..
}
```

#### unhandledrejection

`Promise` 内部未捕获的异常可以通过监听`onunhandledrejection`来捕获

```javascript
window.addEventListener('unhandledrejection', (error, id) => {})
```

如果你想还原出 `Promise` 的错误，关键点是要拿到 `Error Stack`，native 提供的监听方法得不到更多的信息，可以考虑采用 [promise polyfill](https://github.com/taylorhakes/promise-polyfill#unhandled-rejections) 提供的方法来拿到。

> 为什么可以拿到呢？如果你实现过 Promise 的话就很容易理解了，Promise 里面的代码也是同步执行的（只是 notify 的方式是异步的 ），所以 try catch 是可以拿到当前 `Error Stack` 的

### React-native 错误异常

下面我们看如何在 RN 环境当中收集异常，当然这个异常也分为 2 个方面：

#### Runtime Error

由于在 RN 环境当中并不存在`window`这种宿主对象。

只存在`javascriptCore`，所以官方提供了方法：`global.ErrorUtils.setGlobalHandler`来监听全局的错误，可以参考以下代码：

```javascript
import { Platform } from 'react-native'

// 保留原来内部的error handler
const originalHandler = global.ErrorUtils.getGlobalHandler()

// 配置我们自定义的错误 handler
global.ErrorUtils.setGlobalHandler(ErrorHandler)

function ErrorHandler(e, isFatal) {
  if (Platform.OS === 'ios') {
    CrashHandler.originalHandler(arguments)
  } else {
    setTimeout(() => {
      CrashHandler.originalHandler(arguments)
    }, 300)
  }

  __DEV__ && throwErrorToNative()

  // 我们自己的错误处理方式
  // 发送检测数据
  Report.send(e)
}
```

> 资料：[参考官方源码](https://github.com/facebook/react-native/blob/d33b554f5d4bb7856cf2fc21175bab23d8225fe4/packager/react-packager/src/Resolver/polyfills/error-guard.js#L20-L28)

然而，在 RN 当中的错误并没有显式的返回 line 和 column 这两个很重要的值，不要怕，我们有`error.stack`，可以在这上面做文章：

```javascript
/**
 * lsErrorStack
 * @param e
 * @returns {{line: *, column: *}}
 */
function lsErrorStack(e) {
  if (!e || !e instanceof Error || !e.stack) return {}

  try {
    const stack = e.stack.toString().split(/\r\n|\n/),
      frameRE = /:(\d+:\d+)[^\d]*$/

    while (stack.length) {
      const frame = frameRE.exec(stack.shift())
      if (frame) {
        const position = frame[1].split(':')
        return { line: position[0], column: position[1] }
      }
    }
  } catch (e) {
    return {}
  }
}

const error = new Error('this is a test')

// 我们可以得到 line 和 column
console.log(lsErrorStack(e))
```

#### Promise Error

同理，RN 环境当中当然也不能通过上面的`unhandledrejection`来进行监听。

事实上，RN 内部执行的 JavaScript 是通过 babel 编译后的代码，而且这个 babel 上的 Promise 是依赖于一个[Promise lib](https://github.com/then/promise)，刚好这个 lib 上有提供监听未捕获 rejection 的钩子：

```javascript
// 在非开发环境下进行监听
if (!__DEV__) {
  require('promise/setimmediate/rejection-tracking').enable({
    allRejections: true,

    /**
     * onUnhandled
     * @param id
     * @param error
     */
    onUnhandled: (id, error) => {
      // Promise 错误
      this.onUnhandled(id, error)
    },

    /**
     * onHandled
     * @param id
     */
    onHandled: id => {
      this.onHandled(id)
    },
  })
}
```

> 资料：[官方 PR-1](https://github.com/facebook/react-native/blob/b0640946873945ee95d2cab8f549c915dbfffd70/Libraries/Promise.js#L28-L47)
>
> 资料：[官方 PR-2](https://github.com/facebook/react-native/commit/b0640946873945ee95d2cab8f549c915dbfffd70)
>
> 资料：[Promise polyfill](https://github.com/then/promise#unhandled-rejections)

同理，promise error 也可以通过这个方式来得到真正的 line 和 column

#### SourceMap 还原错误完整信息

当 runtime 当中发生了错误，我们收集到了错误，怎么进行还原事发现场呢？

> 我们可以通过完整的`srouceMap`和出错的`line`、`column`来准确还原发生错误时代码上下文。

在 RN 当中我们可以在执行打包命令的时候带上`--sourcemap-output youbundle.map`来生成。

web 环境下就很灵活了，对比常用的打包工具`webpack`、`Rollup`等都提供了很简便的方式去生成 sourcemap。

当然我们可以参照 [moz sourcemap](https://github.com/mozilla/source-map) 来自己生成自定义 sourcemap。

接下来我们可以很简单的还原事发现场：

```javascript
const {
  SourceMapConsumer,
  SourceMapGenerator,
  SourceNode,
} = require('source-map')
const fs = require('fs')

/**
 * rawMap
 */
const rawMap = JSON.parse(fs.readFileSync('./index.map').toString())

const smc = new SourceMapConsumer(rawMap)
const position = smc.originalPositionFor({
  line: 1,
  column: 75422,
})

const { source, line, column } = position

// output
console.log(`事故发生现场：${source}，位于第${line}行，第${column}列！`)
```

当然如果是带有 `sourceContent` 的 sourcemap，我们还能继续还原到具体原始文件，可以参考一下代码：

> 这个方法只针对于存在 sourceContents 的 sourcemap，个别部分不带，比如 RN（RN 需要改打包源码

```javascript
/**
 * 这里认为我们已经按照上诉代码拿到了 consumer 以及 错误的 position
 */
const { source, line, column } = position

/**
 * 我们想还原原始代码上下10行
 */
const showOriginCodeLines = 10
const finalSource = []

/**
 * 通过 consumer sourceContentFor 方法拿到 原始的 代码，并处理换行，转换成数组
 */
const sourceContent = consumer.sourceContentFor(source)
const sourceContentMaps = sourceContent.toString().split(/\r\n|\n/)

/**
 * 这里是垃圾代码，凑合看吧
 * 取上下 showOriginCodeLines 行 组合在一起
 */
for (let i = 0; i < showOriginCodeLines; i++) {
  finalSource.unshift(sourceContentMaps[line - 1 - i])
}

for (let i = 1; i < showOriginCodeLines + 1; i++) {
  finalSource.push(sourceContentMaps[line - 1 + i])
}

/**
 * 输出最终结果
 */
console.log(finalSource.join('\n'))
```

这里拿到原始代码后，我们可以通过一些插件做些简单的高亮，美化等处理，完全可以做一个低配版本的 Sentry 平台。

## 收集性能数据

收集性能数据分为 web 性能数据和 RN 性能数据。

### web 性能数据

web 上的性能数据我们可以通过`performance`API 来收集。

> 当然这个有兼容性的问题，IE 和 Safari 都只能在 11 上得到支持。

具体我们参考这篇 [mdn 介绍](https://developer.mozilla.org/en-US/docs/Web/API/Performance)，以及下面这张简单的介绍图：

![performance api overview](https://www.w3.org/TR/navigation-timing/timing-overview.png)

简单来说就是在 `window.onload` 后来去按照需要获取 `performance` 数据并上传到服务器主机。

目前来说我觉得有用的数据大概是以下几个，仅供参考：

- `domComplete`
- `loadEvent`
- `unloadEvent`
- `request`
- `domContentLoaded`
- `totalImageLoaded`

### React-native 性能数据

RN 上的性能数据其实在**开发**环境当中已经可以查看，生产环境下需要更改 RN 源码来打开 `monitor`，这里不做深入介绍。

### 前端 browser 日志上报优化

日志上报可以选择 ajax 或者 empty GIF 等形式来进行上报，但是如果前端业务复杂、访问量级较大，那么相应地，前端监控上报的日志类型及日志量也会快速增长。

前端监控的最基本原则是日志获取和日志上报不能影响业务性能，所以需要优化上报的性能。

这里大概有以下几种常见的方法：

- HTTP No Content
- HTTP/2 头部压缩，HTTP/2 多路复用
- HTTP post 合并多条信息
- [navigator.sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

#### HTTP No Content

日志上报只关心日志有没有上报，并不关心上报请求的返回内容，甚至完全可以不需要返回内容。所以使用 `HTTP HEAD` 的方式上报，并且返回的响应体为空，可避免响应体传输造成的资源损耗

```javascript
fetch(`${url}?t=perf&page=lazada-home&load=1168`, {
  mode: 'no-cors',
  method: 'HEAD',
})
```

#### HTTP/2 头部压缩

每次 HTTP 请求都会传输一系列的请求头来描述请求的资源及其特性，然而实际上每次请求都有很多相同的值，如 `Host:`、`user-agent:`、`Accept` 等。这些数据会占用 300-800 byte 的传输量，如果携带大的 cookie，请求头甚至会占据 1 kb 的空间，而实际真正需要上报的日志数据仅有 10~50 byte。在 HTTP 1.x 中，每次日志上报请求头都携带了大量的重复数据导致性能浪费。

HTTP/2 [头部压缩](https://link.zhihu.com/?target=https%3A//www.oreilly.com/learning/http2-a-new-excerpt)采用 Huffman Code 压缩请求头，并用动态表更新每次请求不同的数据，从而将每次请求的头部压缩到很小。

#### HTTP/2 多路复用

用户浏览器和日志服务器之间产生多次 HTTP 请求，而在 **HTTP/1.1 Keep-Alive** 下，日志上报会以串行的方式传输，并让后面的日志上报延时。通过 HTTP/2 的多路复用来合并上报，可以节省网络连接的开销。

#### sendBeacon

> 详情可以参考 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon)

有些时候我们需要在 `unload` 或者 `beforeunload` 事件监听当中来进行发送**同步**的 ajax 来上传监控数据，但是同步的 ajax 会导致下一个页面加载能力较差。

虽然采用 empty GIF 的方式可以实现，因为绝大多数用户代理会延迟卸载以保证图片的载入。但是这种方法有较差的编码方式而且不可靠，会影响页面性能。

当使用 `sendBeacon` 方法将会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能。这就解决了提交分析数据时的所有的问题：使它可靠，异步并且不会影响下一页面的加载。

## And More

下面是收集的一些关于前端性能监控方面的文章：

- [蚂蚁金服如何把前端性能监控做到极致?](https://mp.weixin.qq.com/s?__biz=MzUxMzcxMzE5Ng==&mid=2247490527&idx=1&sn=cc2549683b3ff69c042483d78ced766a&chksm=f951ae9cce26278a263ecf2937b5c4957c9b37f35b7efe4c1a8c6ab69c74ebcb43c54e62abda&xtrack=1&scene=0&subscene=131&clicktime=1550933323&ascene=7&devic) 和对应的 [本站 Archive](./蚂蚁金服如何把前端性能监控做到极致.pdf)
