---
title: "使用 nextcloud 搭建个人私有网盘"
subTitle: "使用 nextcloud 搭建个人私有网盘"
tags: ["Docker","折腾"]
date: 2019-02-12T10:58:40+08:00
---

国内各大云网盘要么限速要么需要充值 vip 、超级 vip、超超级 vip。

国外的一些优质云网盘如 `google drive` 和 `one drive` 等由于和谐因素又无法顺利的访问。

本来想买个 `nas` ，看到价格和组 `raid` 的成本放弃了。

刚好我有一台新组装的主机电脑，平时也是偶尔开着，所以特意买了个 `2t` 的希捷数据盘，准备搭建一套私有云的环境给家庭用。


### 开源云盘选择

> 其实在搭建之前，考虑过自己写一个简单的文件系统上传预览，后来发现需要考虑的问题太多卒🤣

搭建前我仔细看了一下各个开源私有云盘的实现，有以下几种：

- owncloud
- sealife
- nextcloud

对这几家比较了以下，考虑了以下因素：

- 开源且免费，可以自定义插件开发
- 全客户端的支持，免费更好，ui 视觉还能过得去
- 支持外挂磁盘，可以随时更改，不需要分块、加密和过多的文件控制、权限控制等等，简单就好
- 部署难度，vm 还行，最好可以 Docker 

最终我选择了 `nextcloud`，至于更多的详细差异，大家可以根据需求选择。


### 内网穿透

由于家里的电信没有外网 ip ，打电话给运营商也无济于事，只能选择内网穿透。

内网穿透选择了很多办法：

- 根据开源实现自己部署到一台公共可访问的服务器上，比如：frp、ngrok等等
- 使用现有的内网穿透服务商，比如：花生壳、natapp 等等

最终我选择了 natapp 免费使用版

### 开始搭建

我个人的网盘需求只是偶尔让我爸妈把照片上传到我的主机上。

对性能、速度、可持续性都没有太高的要求，所以很多条件都可以简化，只要保证数据完整性就可以了。

首先在 Windows 上安装所需要的环境： `Docker` 、`Python` 等。并且在 `E` 盘下创建了特定的 `nas` 文件夹来作为 `nextcloud` 的目录。

### 配置 Docker

创建 `docker-compose.yml` 文件来配置 `Docker` ：

```yaml

version: '2'

volumes:
  data:
  config:
  apps:

services:

  app:
    image: nextcloud
    ports:
      - 8080:80
    volumes:
      - ./data:/var/www/html/data
      - ./config:/var/www/html/config
      - ./apps:/var/www/html/apps

      # 外挂磁盘 /e/nas/extend-disk/ 作为初始数据源
      - /e/nas/extend-disk/:/home

    restart: always

```