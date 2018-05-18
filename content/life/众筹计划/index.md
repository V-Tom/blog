---
title: "众筹计划"
subTitle: "众筹计划"
tags: ["life"]
date: 2018-04-23T11:29:40+08:00
---

### 众筹计划

> TBD 后续内容待补充当中

#### Getstarted

**本计划纯属自愿参加自愿承担责任，可以随时加入随时退出。**

为了科学上网，所以通过网上开源项目建立私人 socks5 proxy （ssr）以及 http proxy （v2ray），因为个人资金原因，现在希望能够众筹

### overview

我提供的内容：

- 稳定的两种科学上网服务（带宽：100mib/s）以及后续平台拓展（IOS 和 ANDROID
- 完善的技术支持以及分享

你需要提供的义务：

- 每月账单根据个人使用量按照 GCE 标准付费，外加平摊 GCE 平台基础费
- 保密

#### cost

GCE 最新价格，按照最小的 vps 实例来计算：

- 月基础费用 $5，按照人头平分
- 流量按量付费 0.1$/1gb

#### tech plan

暂定技术内容：

- golang gin http web(websocket) server
- D3-charts
- SQLIT
- shell script
- crontab、iptables、awake

目前需要实现以下功能：

- 提供一个 ping test 工具，不同的 ip 可能不同用户存在延迟大的情况，目前的办法只能是换主机
- 可视化：提供一个完整的 GCE 收费情况以及账单查询渠道，可以考虑在可视化平台当中公布
- 给每个用户提供一个密匙可以登入 共享GCE，确保大家只操作自己的 workspace，建立服务尽量统一采用 docker 来减少 environment 污染
- 可视化：每日暂定8点定时任务记录所有用户使用情况，计算当日流量，并写入数据库，供以后汇总查询。
- 可视化：提供一个可视化平台可以随时查看当前用户使用情况并鉴权，间隔大概在 10s 内（通过 websocket 通信

#### proxy

绝大部分应用程序都支持 proxy，下面简单罗列一些常用应用程序配置代理的方法。

> 个人理解如果流量过大，或者 proxy 也不行的情况下，应该采用更换镜像的方式。

##### git 设置只代理 GitHub

直接在 terminal 当中执行下面 bash

```bash
# 设置
git config --global http.https://github.com.proxy socks5://127.0.0.1:1080

# 取消代理
git config --global --unset http.https://github.com.proxy
```

执行后配置内容会默认保存在 `~/.gitconfig` 当中。

##### terminal 设置代理

把下面命令放置在 `~/.zshrc` 或者直接写成 alias 的形式

```bash
# ~/.zshrc
export http_proxy="socks5://127.0.0.1:1086"
export https_proxy="socks5://127.0.0.1:1086"
```

