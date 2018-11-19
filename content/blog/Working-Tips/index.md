---
title: "working tips"
tags: ["Tips"]
description: "There are my working tips list"
date: 2018-07-23T09:23:43+08:00
---



### 将 ssr 转换为 http 代理

> 前景概要：我用的魔改版本的 ssr ，不带 http proxy，但是我需要在 terminal 当中使用代理。而且公司原因完全没有 sudo 权限，brew 也废掉了。但是本地 git 是可以通过 sock5 代理的。
>
> 我知道可以通过 proxychains4 或者 proxychains-ng 可以实现。也由于懒不想换 ss 或者 v2ray，而且由于 mac sip 的原因没法成功，主要还是没有 sudo 权限。

找了好久，[查到了解决办法](https://github.com/shadowsocks/shadowsocks/wiki/Convert-Shadowsocks-into-an-HTTP-proxy)，利用这个库 [polipo](https://github.com/jech/polipo) 是可以实现所需要的功能，具体步骤如下。

```bash
#!/usr/bin/env bash

# 下载 polipo 源码本地编译
git clone https://github.com/jech/polipo.git
cd polipo && make

# 设置 socks5 代理自动给 http proxy 的端口
./polipo socksParentProxy=localhost:1086 &

# 默认的 http proxy 端口为 8123，可以参照下面的 wiki 来配置 config file
export http_proxy="http://127.0.0.1:8123"; export HTTP_PROXY="http://127.0.0.1:8123"; export https_proxy="http://127.0.0.1:8123"; export HTTPS_PROXY="http://127.0.0.1:8123"

# 将会得到代理服务器的地址
curl cip.cc
 
```

#### reference

- [polipo wiki](https://wiki.archlinux.org/index.php/polipo)