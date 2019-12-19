---
title: 'My Recent Notes (mostly entertainment)'
subTitle: 'My Recent Notes (mostly entertainment)'
tags: ['life']
date: 2019-07-27T13:12:30+08:00
---

> 此文稿列出了我最近的一些安排，主要是娱乐安排，比如电影、电视剧、游戏、旅游之类的，每个种类已经手动按照时间进行排序

## Code

> 很不幸 Nothing

## Movies

- [硅谷 第六季 Silicon Valley Season 6 (2019) 首播: 2019-10(美国)](https://movie.douban.com/subject/30194648/)

已经开播，[1080P 下载地址](http://www.btyun.tv/tvshows/silicon-valley/) 和 [字幕地址](https://subhdtw.com/d/30194648)

- [苍穹浩瀚 第四季 The Expanse Season 4 (2019) 首播: 2019-12-13(美国)](https://movie.douban.com/subject/30234319/)

已经开播，[1080P 下载地址](http://www.btyun.tv/tvshows/the-expanse/)

- [星际迷航：发现号 第三季 Star Trek: Discovery Season 3 (2020) 首播: 2020-01(美国)](https://movie.douban.com/subject/30473976/)

- [新世纪福音战士新剧场版：终 首播: 2020](https://zh.wikipedia.org/wiki/%E6%96%B0%E4%B8%96%E7%BA%AA%E7%A6%8F%E9%9F%B3%E6%88%98%E5%A3%AB%E6%96%B0%E5%89%A7%E5%9C%BA%E7%89%88%EF%BC%9A%E7%BB%88)

- [曼达洛人 第一季 首播：Nov. 12, 2019](http://www.btyun.tv/tvshows/the-mandalorian/)

已经开播，[4K，1080P 下载地址](http://www.btyun.tv/tvshows/the-mandalorian/)

## Games

- [Cyberpunk 2077 Initial release date: April 16, 2020](https://www.cyberpunk.net/)

## NAS

自建 NAS 的所需硬件以及需要满足条件简单如下表：

> ECC 自带自动纠错，对于 7\*24h 运行的机器很有用，适合大数据量以及比较重要的数据，个人的 NAS 看需求是否需要 ECC Memory Supported（会省下很多银子）

- Motherboard（ECC Memory Supported）需要至多的 SATA 口
- CPU（ECC Memory Supported）RAID
- RAM（ECC Memory Supported）
- 支持 7\*24h 运行的数据盘
- 整体的 TDP 也要考虑，可以装好后跑一下 [adida 64](https://www.aida64.com/) 来确认是否需要散热器
- NAS 系统，这里推荐 [Free NAS](https://www.freenas.org/)

主板这里推荐 ASRock（华擎）的主板，主要是它家自古出妖板，至于主板的尺寸 ATX 还是 ITX 看你的机箱大小和电源了。

ASRock 主板可以在它家[官网查询所需要的型号](https://www.asrockrack.com/general/products.tw.asp#Server)，主要过滤条件是 SATA 接口数量和 ECC Memory Supported 和 RAID 支持程度，另外可以根据个人需求是否需要支持万兆网络

[CPU 支持 ECC](https://ark.intel.com/content/www/us/en/ark/search/featurefilter.html?productType=873&0_ECCMemory=True) 可以在 intel 官网上过滤条件查询，可以根据你选择的主板接口类型（sockets）以及型号（intel family），可以添加更多的筛选条件。

> 比如：主板接口类型（sockets）需要 `LGA1151` ，型号（intel family）需要 `XENO`，所以更新下[查询条件](https://ark.intel.com/content/www/us/en/ark/search/featurefilter.html?productType=873&0_ECCMemory=True&1_Filter-SocketsSupported=3582&1_Filter-Family=595)就可以查询了

**CPU 不用需要太高的性能，查询出来的表格直接拉到最下面去淘宝查询价格就行了**

至于 RAM 和 数据盘选择主流就行

然后去 [Free NAS](https://www.freenas.org/) 官网下载镜像安装就可以了

组装 RAID 方案可以根据需求来定，建议组 RAID 5，其中的区别和其他 RAID 的区别可以看这个[RAID 入门视频](https://www.youtube.com/watch?v=U-OCdTeZLac)
