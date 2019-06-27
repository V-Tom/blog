---
title: 'Serverless 入门'
subTitle: 'Serverless 入门'
tags: ['BackEnd']
date: 2019-04-12T12:52:40+08:00
host: ''
---

## Serverless 是什么

根据 CNCF 的定义，Serverless 是指构建和运行不需要服务器管理的应用程序的概念。[(serverless-overview)](https://github.com/cncf/wg-serverless/tree/master/whitepapers/serverless-overview)

> Serverless computing refers to the concept of building and running applications that do not require server management. --- CNCF

简单来讲，Serverless 指的是在构建 Web 应用程序的时候，而不用担心如何配置服务器，但是这并不意味着应用程序不会在服务器上运行，而是说服务器的管理都可以尽可能地交给相应的云平台，从而最大程度地减轻开发人员的部署与配置工作。与之对应的一个名词可能就是 `Function As a Service（FAAS）`，由 AWS Lambda 这个命名上就能想到，当我们在构建 Serverless 架构时，实际上我们是在写一个个的 Function 即函数而已

## 为什么要用 Serverless

云计算有常用的三种模式，如下图：

![saas-paas-iaas-diagram]('./saas-paas-iaas-diagram.png)

云计算的三种模型是 PaaS，SaaS（软件即服务）和 IaaS（基础架构即服务）。

- IaaS 是指云计算基础架构 - 服务器，存储等 - 由云供应商管理
- SaaS 是指托管在云中并由 SaaS 供应商维护的完整应用程序。
- 如果 SaaS 客户就像租房子一样，那么 PaaS 客户就像租用快速建造房屋所需的所有重型设备和电动工具一样，如果工具和设备由其所有者不断维护和修理。

### Serverless 的优势

### 降低启动成本

### 实现快速上线

### 系统安全性更高

### 适应微服务架构

### 自动扩展能力

## Serverless 的劣势

### 不适合长时间运行应用

### 完全依赖于第三方服务

### 冷启动时间和性能

### 缺乏调试和开发工具

### 函数的测试

### 构建复杂（主要是各个云平台的差异

## 基于 Serverless 的前端开发模式

### BFF

### 服务端渲染

### 小程序开发

## Serverless 的适用场景

## 简单总结

## Reference

- [https://serverless.com/](https://serverless.com/)
