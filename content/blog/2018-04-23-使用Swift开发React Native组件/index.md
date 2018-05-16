---
title: "使用Swift开发React Native组件"
tags: ["Native","FrontEnd","RN"]
description: "使用Swift开发React Native组件"
date: 2018-04-23T14:28:25+08:00
---



https://blog.csdn.net/jancywen/article/details/77945296

https://www.jianshu.com/p/82d0ba43f8c3

https://reactnative.cn/docs/0.51/linking-libraries-ios.html#content



### 环境准备

因为 swift 的断崖式升级以及 RN 不同版本，所以下面的例子可能会存在一些误差。本机环境为：

- RN：0.45.1
- swift：4.1
- Xcode：9.3
- OS：high sierra

### CocoaPods

CocoaPods是专门为 iOS 工程提供对第三方库的依赖的管理工具，通过 CocoaPods ，我们可以更方便地管理每个第三方库的版本，而且不需要我们做太多的配置。直观、集中和自动化地管理我们项目的第三方库。

我们都有这样的经历，当我们添加第三方库的时候，需要导入一堆相关依赖库，更新的时候也要删掉重新导入然后再配置。当我们需要更新某个第三方库的时候，我们又要手动移除该库，导入新的库，然后再配置。这些是很麻烦且没有意义的工作。

安装 CocoaPods 需要用到 gem 。gem 是 [RubyGems](http://rubygems.org/) 的缩写，属于 ruby 上的包管理工具。

这里建议切换国内镜像源地址，当然你也可以加上 `-p` 参数来配置 proxy

```bash
gem sources --remove https://rubygems.org/ && gem sources -a https://gems.ruby-china.org/
```

将 RubyGems 升级到最新版本，不然有可能导致配置 CocoaPods 失败。

```bash
sudo gem update --system
```

可以使用下面命令来查看替换镜像位置是否成功：

```bash
gem sources -l
```

结果应该是：

```
*** CURRENT SOURCES ***

https://gems.ruby-china.org/
```

接下来就可以放心的安装 CocoaPods了：

```bash
sudo gem install cocoapods
```

然后继续进行 setUp：

```bash
pod setup
```

这一步是将Github上的开源库都托管都安装Podspec索引安装到到本地，这一步会很慢，建议添加本地 proxy。

我使用 ShadowsocksR 代理，默认代理端口为1080，配置好代理之后去终端输入git配置命令。

如果你同事电脑上有安装好,你其实可以从你同事电脑上拷贝过来。也可以直接访问 [https://github.com/CocoaPods/Specs](https://link.jianshu.com/?t=https://github.com/CocoaPods/Specs) 这个源地址直接 download 下来。

> 如何恢复 git config proxy 可以采用 `git config --global --unset http.proxy`

```bash
# gloabl proxy
git config --global http.proxy socks5://127.0.0.1:1080

# only github proxy
git config --global http.https://github.com.proxy socks5://127.0.0.1:1080
```

下载安装完毕后会是如下图：

![pod-setup.png](./pod-setup.png)

然后检测版本：`pod --version`，我这里显示是 1.5.0，至此 CocoaPods 安装完毕。

接下来 `pod install` 的时候也会遇到速度较慢的问题，可以切换为[国内镜像](https://mirror.tuna.tsinghua.edu.cn/help/CocoaPods/)，我这里直接添加 proxy了。

### 创建项目

在下面的例子当中我们会创建一个简单的 demo 来实现 custom React Native module。

#### 创建基础模板

我们先通 xcode 来创建一个 swift 项目，姑且命令为 `pocket` ，为了方便测试，我们选择 `Tabbed App` 来作为模板，并且 language 我们当然选择 swift，不选择单元测试功能：

![create-new-project.png](./create-new-project.png)

#### 创建前端工作区

在项目目录当中创建一个名为 RNComponent 的文件夹来放置官方 React Native module 以及前端代码，然后创建一个 `package.json` 来写入依赖：

```bash
# 在当前目录下执行操作
mkdir RNComponent && cd RNComponent && touch package.json
```

`package.json` 文件内容大致如下：

> 当然也可以自定义 React 和 RN 版本，自然少不了需要解决版本兼容性的问题。

```json
{
    "name": "RNComponent",
    "version": "0.0.0",
    "private": true,
    "scripts": {
        "start": "node node_modules/react-native/local-cli/cli.js start --reset-cache"
    },
    "dependencies": {
        "react": "16.0.0-alpha.12",
        "react-native": "0.45.1"
    }
}

```

接下来安装依赖：`npm i -d ` 。

接下来的步骤大家都很熟悉了，我们需要创建一个入口文件 `index.ios.js`，我们用来跑测试 RN 代码，内容大致如下：

```js
import { AppRegistry, NativeModules, View, Text, StyleSheet } from 'react-native';
import React from 'react';

class Root extends React.Component {
    render() {
        return (
            <View style={styles.container}>
            <Text> hello world </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

AppRegistry.registerComponent('App', () => Root);
```

至此，前端目录部分工作完成。

#### 创建 swift 工作区

进入项目根目录，初始化 Podfile，不要手动创建 Podfile：

```bash
pod init
```

我们在刚才生成的 `Podfile` 文件当中 `use_frameworks! ` 关键词下换行添加以下依赖：

> 请注意下面当中的 path 是相对于我们之前的前端工作区的 node_modules 的地址。

```txt
   # 请注意这个目录是相对目录地址。
  pod 'Yoga', :path => './RNComponent/node_modules/react-native/ReactCommon/yoga'
  # 请注意这个目录是相对目录地址。
  pod 'React', :path => './RNComponent/node_modules/react-native’,:subspecs => [
      'Core',
      'ART',
      'RCTActionSheet',
      'RCTAdSupport',
      'RCTGeolocation',
      'RCTImage',
      'RCTNetwork',
      'RCTPushNotification',
      'RCTSettings',
      'RCTText',
      'RCTVibration',
      'RCTWebSocket',
      'RCTLinkingIOS',
      'jschelpers_legacy',
      'BatchedBridge',
      'DevSupport',
    ]
```

最后执行 `pod install` 执行安装依赖操作：

![pod-install.png](./pod-install.png)

对于安装后出现的黄色 warning，读者可以自行查阅原因并解决。（不过一般都是无视。。。

至此我们的 swift 工作区创建完毕。

#### 添加 RNViewController 渲染 RN

我们需要添加 **RNViewController** 来渲染我们的 RN，因为我们创建的是一个 `Tabbed App`，所以默认项目结构是这样：

![xcode-workspace-overview.png](../2018-04-23-%E4%BD%BF%E7%94%A8Swift%E5%BC%80%E5%8F%91React%20Native%E7%BB%84%E4%BB%B6/xcode-workspace-overview.png)

简单介绍一下项目文件的用途：

- `XXViewController.swift`
- `AppDelegate.swift`
- `Main.storyboard`
- `LaunchScreen.storyboard`
- `Info.plist`

我们需要在 `FirstViewController.swift` 当中指定 **RNViewController** ，在 `viewDidLoad ` 当中添加一下代码：

```swift
    override func viewDidLoad() {
        super.viewDidLoad() 
        // 这个是我们 RN development 地址，ip 对应本机局域网 ip，建议不要写 localhost
        let strUrl: String = "http://10.0.36.112:8081/index.ios.bundle?platform=ios&dev=true"
        let jsCodeLocation = URL(string: strUrl)
        let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "App", initialProperties: nil, launchOptions: nil)
        view = rootView
    }
```

####  swift 工作区额外处理

当然 ios 开发会有各种各样的问题需要去处理，我在这里列出一些当前项目可能会出现的一些问题：

> ios9 以上的系统，无法通过http协议连接到localhost主机，会出现错误：Could not connect to development server

在工程当中的 `Info.list` 文件当中添加下面配置即可：

```xml
<key>NSAppTransportSecurity</key>  
  <dict>  
  <key>NSExceptionDomains</key>  
  <dict>  
      <key>localhost</key>  
      <dict>  
      <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>  
      <true/>  
     </dict>  
   </dict>  
  </dict>  
```

配置结果如下：

![info-list.png](../2018-04-23-%E4%BD%BF%E7%94%A8Swift%E5%BC%80%E5%8F%91React%20Native%E7%BB%84%E4%BB%B6/info-list.png)

> Xcode 一直打印：nw_connection_get_connected_socket_block_invoke 3 Connection has no connected handler  

解决办法如下：

- Xcode menu -> Product -> Edit Scheme... 
- Environment Variables -> Add -> Name: "OS_ACTIVITY_MODE", Value:"disable" .
-  Run your app again. done.

### Reference

- [CocoaPods最新安装(不使用淘宝镜像)](https://www.jianshu.com/p/adad5ee721af)
- [看一遍就会的CocoaPods的安装和使用教程](https://www.jianshu.com/p/1711e131987d)
- [RubyGems *- Ruby China*](https://gems.ruby-china.org/)
- [[IOS/MAC] -Integrating react-native app with existing apps not creating .workspace](https://github.com/facebook/react-native/issues/7775)
- [objective-c 语法快速过](http://www.cnblogs.com/kubixuesheng/p/4306395.html)
- [Got “is not a recognized Objective-C method” when bridging Swift to React-Native](https://stackoverflow.com/questions/39692230/got-is-not-a-recognized-objective-c-method-when-bridging-swift-to-react-native)