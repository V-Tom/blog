---
title: 'some interview question'
subTitle: 'some interview question'
tags: ['interview']
date: 2019-07-23T14:01:30+08:00
host: ''
draft: true
---

### list

- webpack loader && webpack plugins
- webp 图片的浏览器兼容检测
- jsCore
- DSL
- 漫画浅显解释和对比 docker 、K8S
- React 合成事件
- Event Loop
- 堆内存与栈内存

### webpack loader && webpack plugins

一些简单的区别：

`loader` 在生成包期间或之前在单个文件级别工作。

`plugins` 在 bundle 或 chunk 级别工作，通常在 bundle 生成过程结束时工作。`plugins` 还可以修改捆绑包本身的创建方式。插件比 `loader` 具有更强大的控制能力。

![loader-vs-plugins.png](./loader-vs-plugins.png)

- [Webpack loaders vs plugins; what's the difference?](https://stackoverflow.com/questions/37452402/webpack-loaders-vs-plugins-whats-the-difference)
- [Webpack 原理-编写 Plugin](https://juejin.im/post/5a5c18f2518825734f52ad65)
- [深入 Webpack-编写 Loader](https://segmentfault.com/a/1190000012718374)

### webp 图片的浏览器兼容检测

- canvas ：`return /^data:image\/webp/.test(document.createElement('canvas').toDataURL('image/webp', 0.5));`

- HTTP header：浏览器在图片请求发出的时候，Request Headers 里有 Accept，服务端可以根据 Accept 里面是否有 image/webp 进行判断。

- new Image：先加载一个 WebP 图片，如果能获取到图片的宽度和高度，就说明是支持 WebP 的，反之则不支持

### jsCore

- [深入理解 JSCore](https://tech.meituan.com/2018/08/23/deep-understanding-of-jscore.html)

### DSL

- [谈谈 DSL 以及 DSL 的应用](https://draveness.me/dsl)
- [用 25 行 JavaScript 语句实现一个简单的编译器](https://juejin.im/entry/59cdbe11f265da06633d4ac2)

### 漫画浅显解释和对比 docker 、K8S

- [小女孩也能看懂的插画版 Kubernetes 指南](https://linux.cn/article-7531-1.html)
- [漫画 | Kubernetes 带你一帆风顺去远航](https://blog.csdn.net/M2l0ZgSsVc7r69eFdTj/article/details/78890222)

### React 合成事件

- [谈谈 React 事件机制和未来(react-events)](https://zhuanlan.zhihu.com/p/78669634)

### Event Loop

- [浏览器与 Node 的事件循环(Event Loop)有何区别?](https://juejin.im/post/5c337ae06fb9a049bc4cd218)

### 堆内存与栈内存

- [前端知识点总结——堆内存与栈内存](https://zhuanlan.zhihu.com/p/27534451)
- [什么是堆？什么是栈？他们之间有什么区别和联系？](https://www.zhihu.com/question/19729973)
