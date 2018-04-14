---
title: "RN性能检测和错误捕捉"
subTitle: "RN性能检测和错误捕捉"
banner: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=="
tags: ["RN","FrontEnd","Monitor"]
date: 2017-09-12T15:29:40+08:00
---

在复杂的网络环境和浏览器环境下，自测、QA测试以及 Code Review 都是不够的，如果对页面稳定性和准确性要求较高，就必须有一套完善的代码异常监控体系好的产品，这样才能很好的得到用户的反馈从而不断的迭代改进我们的产品。

而且复杂的用户终端设备，也需要通过性能监控发现部分前端性能瓶颈，以便进行优化；通过错误日志收集，及时获得前端的运行时错误

## 收集错误异常

> 错误异常分为 **web 错误异常**和**React-native 错误异常**

### web 错误异常

总体来说：平时收集日志的手段，可以归类为两个方面，一个是逻辑中的错误判断，为主动判断，如` try...catch`；一个是利用语言给我们提供的捷径，暴力式获取错误信息，如  `window.onerror`；当然也存在另外一种错误，那就是`Promise unhandlerejection`

#### try…catch

判断一个代码段中可能存在的错误：

```javascript
try {
  doSomeThing()
  // code...
} catch(e){
  // send format error
  Reporter.send(format(e))
}
```

#### window.onerror

这个用来捕获全局错误：

```javascript
window.onerror = function() {
  // send format error
  var errInfo = format(arguments);
  Reporter.send(errInfo)
  return true
};
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
window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) { 
    // code..
}
```

#### unhandledrejection

`Promise`内部未捕获的异常可以通过监听`onunhandledrejection`来捕获

```javascript
window.addEventListener('unhandledrejection',(error,id)=>{
    
  })
```

### React-native 错误异常

下面我们看如何在RN环境当中收集异常，当然这个异常也分为2个方面：

#### Runtime Error

由于在RN环境当中并不存在`window`这种宿主对象。

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

然而，在RN当中的错误并没有显式的返回line和column这两个很重要的值，不要怕，我们有`error.stack`，可以在这上面做文章：

```javascript
/**
 * lsErrorStack
 * @param e
 * @returns {{line: *, column: *}}
 */
function lsErrorStack(e) {

  if (!e || !e instanceof Error || !e.stack) return {}

  try {
    const stack = e.stack.toString().split(/\r\n|\n/), frameRE = /:(\d+:\d+)[^\d]*$/;

    while (stack.length) {
      const frame = frameRE.exec(stack.shift())
      if (frame) {
        const position = frame[1].split(':')
        return { line: position[0], column: position[1] }
      }
    }
  } catch ( e ) {
    return {}
  }
}

const error = new Error('this is a test')
  
  // 我们可以得到 line 和 column
console.log(lsErrorStack(e))
```

#### Promise Error

同理，RN环境当中当然也不能通过上面的`unhandledrejection`来进行监听。

事实上，RN内部执行的JavaScript是通过babel编译后的代码，而且这个babel上的Promise是依赖于一个[Promise lib](https://github.com/then/promise)，刚好这个lib上有提供监听未捕获rejection的钩子：

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
        onHandled: (id) => {
          this.onHandled(id)
        }
      })

    }
```

> 资料：[官方PR-1](https://github.com/facebook/react-native/blob/b0640946873945ee95d2cab8f549c915dbfffd70/Libraries/Promise.js#L28-L47)
>
> 资料：[官方PR-2](https://github.com/facebook/react-native/commit/b0640946873945ee95d2cab8f549c915dbfffd70)
>
> 资料：[Promise polyfill](https://github.com/then/promise#unhandled-rejections)

同理，promise error 也可以通过这个方式来得到真正的 line 和 column 

#### SourceMap 还原错误完整信息

当runtime当中发生了错误，我们收集到了错误，怎么进行还原事发现场呢？

> 我们可以通过完整的`srouceMap`和出错的`line`、`column`来准确还原发生错误时代码上下文。

在RN当中我们可以在执行打包命令的时候带上`--sourcemap-output youbundle.map`来生成。

web环境下就很灵活了，对比常用的打包工具`webpack`、`Rollup`等都提供了很简便的方式去生成sourcemap。

当然我们可以参照 [moz sourcemap](https://github.com/mozilla/source-map) 来自己生成自定义sourcemap。

接下来我们可以很简单的还原事发现场：

```javascript
const { SourceMapConsumer, SourceMapGenerator, SourceNode } = require('source-map')
const fs = require('fs')

/**
 * rawMap
 */
const rawMap = JSON.parse(fs.readFileSync('./index.map').toString())

const smc = new SourceMapConsumer(rawMap)
const position = smc.originalPositionFor({
    line: 1,
    column: 75422
  })

const { source, line, column } = position

// output
console.log(`事故发生现场：${source}，位于第${line}行，第${column}列！`)
```

当然如果是带有 `sourceContent` 的sourcemap，我们还能继续还原到具体原始文件，可以参考一下代码：

> 这个方法只针对于存在 sourceContents 的 sourcemap，个别部分不带，比如RN（RN需要改打包源码

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

收集性能数据分为web性能数据和RN性能数据。

### web 性能数据

web上的性能数据我们可以通过`performance`API来收集。

> 当然这个有兼容性的问题，IE和Safari都只能在11上得到支持。

具体我们参考这篇 [mdn介绍](https://developer.mozilla.org/en-US/docs/Web/API/Performance)，以及下面这张简单的介绍图：

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

RN上的性能数据其实在**开发**环境当中已经可以查看

> prod环境需要更改RN源码来打开 monitor

TBD